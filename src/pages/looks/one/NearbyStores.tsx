/**
 * Look 1 — Nearby stores: an interactive map of Jeddah.
 *
 * Not a map dropped into a box. The basemap is a custom label-free style in
 * the Look 1 palette (public/looks/map-style.json), so the only type on it is
 * ours: black monogram pins matching the store cards above, distance rings
 * drawn like an architect's survey, and an olive arc from the starting point
 * to the selected store. The index of locations floats over the map on
 * desktop and sits under it on touch.
 *
 * Distances are straight-line (the arc is deliberately not a road), and the
 * panel says so. The map starts in central Jeddah; "use my location" moves
 * the starting point only when the visitor is actually in the Jeddah area.
 *
 * Loaded lazily by NearbyStoresSlot, so none of this reaches the first paint.
 * Tiles: CARTO basemaps (free tier, attribution required) — production needs
 * a proper tile plan.
 */
import 'maplibre-gl/dist/maplibre-gl.css';
import { AttributionControl, MapLibreMap, Marker, setWorkerUrl, type GeoJSONSource } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Crosshair, LocateFixed, MapPin, Minus, Plus } from 'lucide-react';
import {
  MAP_ORIGIN,
  STORE_LOCATIONS,
  distanceKm,
  isOpenNow,
  searchPath,
  lookBase,
  storeOf,
  type StoreLocation,
} from '../lookShared';
import { HAIR, INK, OLIVE, Reveal, SectionHeading, ViewMore, eyebrowCls, useLook } from './ui';

// Vite pre-bundles the library, which breaks its import.meta.url worker lookup;
// hand it a worker Vite has bundled itself.
setWorkerUrl(workerUrl);

type LatLng = { lat: number; lng: number };
type Bounds = [[number, number], [number, number]];

const LAND = '#EEE7DB'; // map ground, same as the style's background
const RINGS = [2, 4, 8, 16]; // km, doubling like a survey grid
const JEDDAH_RADIUS_KM = 80; // beyond this, "my location" is not meaningful here
const MAP_BOUNDS: Bounds = [[38.75, 21.15], [39.65, 22.05]];
const KM_PER_DEG = 111.32;

const AR_LOCALE = { 'AttributionControl.ToggleAttribution': 'إظهار مصادر الخريطة' };

const DAYS = {
  en: ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'],
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
};

/* MapLibre's stylesheet is unlayered, so it outranks Tailwind utilities; these
   overrides put the site's type and palette back on the map chrome. */
const MAP_CSS = `
@keyframes nearby-pulse { 0% { transform: scale(1); opacity: .8 } 100% { transform: scale(1.9); opacity: 0 } }
[data-nearby-map].maplibregl-map { font: inherit; }
/* the full-map "hold Ctrl" overlay is replaced by a quiet hint line at the top of the map */
[data-nearby-map] .maplibregl-cooperative-gesture-screen { display: none; }
[data-nearby-map] .maplibregl-ctrl-attrib { font: inherit; font-size: 10px; background: rgba(253,252,249,.88); color: #737373; }
[data-nearby-map] .maplibregl-ctrl-attrib a { color: inherit; }
[data-nearby-map] .maplibregl-canvas:focus-visible { outline: 2px solid #5A6B4D; outline-offset: -2px; }
`;

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const lngScale = (lat: number) => Math.cos((lat * Math.PI) / 180);

function ring(c: LatLng, km: number, steps = 120): [number, number][] {
  const dLat = km / KM_PER_DEG;
  const dLng = km / (KM_PER_DEG * lngScale(c.lat));
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return [c.lng + dLng * Math.cos(a), c.lat + dLat * Math.sin(a)];
  });
}

function box(c: LatLng, km: number): Bounds {
  const dLat = km / KM_PER_DEG;
  const dLng = km / (KM_PER_DEG * lngScale(c.lat));
  return [[c.lng - dLng, c.lat - dLat], [c.lng + dLng, c.lat + dLat]];
}

const north = (c: LatLng, km: number): [number, number] => [c.lng, c.lat + km / KM_PER_DEG];

/** A gentle quadratic arc, computed in a locally flat plane so the bend is even. */
function arc(a: LatLng, b: LatLng, steps = 64): [number, number][] {
  const k = lngScale(a.lat);
  const ax = a.lng * k, ay = a.lat, bx = b.lng * k, by = b.lat;
  const cx = (ax + bx) / 2 - (by - ay) * 0.22;
  const cy = (ay + by) / 2 + (bx - ax) * 0.22;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps, u = 1 - t;
    return [(u * u * ax + 2 * u * t * cx + t * t * bx) / k, u * u * ay + 2 * u * t * cy + t * t * by];
  });
}

const ringsData = (c: LatLng): FeatureCollection<Polygon, { km: number }> => ({
  type: 'FeatureCollection',
  features: RINGS.map((km) => ({ type: 'Feature', properties: { km }, geometry: { type: 'Polygon', coordinates: [ring(c, km)] } })),
});

const lineData = (coords: [number, number][]): FeatureCollection<LineString> => ({
  type: 'FeatureCollection',
  features: coords.length > 1 ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: coords } }] : [],
});

const nearestTo = (p: LatLng) =>
  STORE_LOCATIONS.reduce((best, l) => (distanceKm(p, l) < distanceKm(p, best) ? l : best));

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

const fmtKm = (km: number) => (km < 10 ? km.toFixed(1) : String(Math.round(km)));
const hh = (h: number) => `${String(h % 24).padStart(2, '0')}:00`;
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const countLabel = (n: number, isAr: boolean) =>
  isAr
    ? n === 1 ? 'فرع واحد' : n === 2 ? 'فرعان' : n <= 10 ? `${n} فروع` : `${n} فرعًا`
    : `${n} ${n === 1 ? 'Location' : 'Locations'}`;

const directionsUrl = (l: StoreLocation, from?: LatLng) =>
  `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}${from ? `&origin=${from.lat},${from.lng}` : ''}`;

/* ------------------------------------------------------------------ */
/* Marker elements (plain DOM — MapLibre positions them)               */
/* ------------------------------------------------------------------ */

function node<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string) {
  const n = document.createElement(tag);
  n.className = cls;
  if (text) n.textContent = text;
  return n;
}

function buildPin(loc: StoreLocation, isAr: boolean): HTMLButtonElement {
  const store = storeOf(loc.store);
  const name = isAr ? store.name.ar : store.name.en;
  const district = isAr ? loc.district.ar : loc.district.en;

  // MapLibre owns the outer element's inline transform, so every visual state
  // (dimmed, stacked) lives on the inner wrapper.
  const pin = node('button', 'group block outline-none data-[stacked=true]:pointer-events-none');
  pin.type = 'button';
  pin.dataset.testid = `nearby-pin-${loc.id}`;
  pin.setAttribute('aria-label', `${name} — ${district}`);

  const inner = node(
    'span',
    'relative flex origin-bottom flex-col items-center transition-[opacity,scale] duration-300 group-data-[dim=true]:opacity-30 group-data-[stacked=true]:scale-75 group-data-[stacked=true]:opacity-0',
  );

  // name card: shown for the selected pin and on hover. Above the pin by default;
  // placePins drops it below near the top edge and aligns it to a side near the edges.
  const card = node(
    'span',
    [
      'pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 translate-y-1 whitespace-nowrap border border-[#E8E4DC] bg-white px-3.5 py-2.5 text-start opacity-0 shadow-[0_14px_34px_rgba(23,21,18,0.14)] transition-[opacity,translate] duration-300',
      'group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100 group-data-[hover=true]:translate-y-0 group-data-[hover=true]:opacity-100',
      'group-data-[below=true]:bottom-auto group-data-[below=true]:top-full group-data-[below=true]:mb-0 group-data-[below=true]:mt-2',
      'group-data-[align=left]:left-0 group-data-[align=left]:translate-x-0',
      'group-data-[align=right]:left-auto group-data-[align=right]:right-0 group-data-[align=right]:translate-x-0',
    ].join(' '),
  );
  card.dataset.role = 'card';
  card.dir = isAr ? 'rtl' : 'ltr';
  card.append(
    node('span', `block font-bold text-[#171512] ${isAr ? 'text-[13px]' : 'text-[11px] uppercase tracking-[0.16em]'}`, name),
    node('span', 'mt-1 block text-[11px] font-light text-neutral-500', district),
  );

  // the monogram, same badge as the store cards
  const badge = node(
    'span',
    "relative flex h-10 w-10 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[12px] font-bold tracking-[0.06em] text-white shadow-[0_6px_16px_rgba(23,21,18,0.22)] transition-[background-color,scale] duration-300 group-hover:bg-[#5A6B4D] group-focus-visible:bg-[#5A6B4D] group-data-[active=true]:scale-110 group-data-[active=true]:bg-[#5A6B4D]",
    store.initials,
  );
  badge.dir = 'ltr';
  const more = node(
    'span',
    "pointer-events-none absolute -right-2 -top-2 hidden h-5 min-w-5 items-center justify-center border-2 border-white bg-[#5A6B4D] px-1 font-['Outfit',sans-serif] text-[9px] font-bold leading-none text-white group-data-[more=true]:flex",
  );
  more.dataset.role = 'more';
  badge.append(
    node('span', 'pointer-events-none absolute inset-0 border border-[#5A6B4D] opacity-0 group-data-[active=true]:animate-[nearby-pulse_2.2s_ease-out_infinite] motion-reduce:!animate-none'),
    more,
  );

  inner.append(
    card,
    badge,
    node('span', 'h-2.5 w-px bg-[#171512] group-data-[active=true]:bg-[#5A6B4D]'),
    node('span', 'h-[5px] w-[5px] bg-[#171512] group-data-[active=true]:bg-[#5A6B4D]'),
  );
  pin.append(inner);
  return pin;
}

/** Closer than this on screen and two badges would overlap. */
const STACK_PX = 48;

/**
 * Runs on every camera move. Pins that would land on a pin already placed are
 * hidden and counted on it as "+n" (zooming in separates them); `order` puts the
 * selected store first so it is never the one hidden. Name cards are kept
 * inside the frame.
 */
function placePins(map: MapLibreMap, pins: Map<string, HTMLElement>, order: string[]) {
  const width = map.getContainer().clientWidth;
  const kept: { id: string; x: number; y: number; more: number }[] = [];
  const points = new Map<string, { x: number; y: number }>();
  for (const id of order) {
    const loc = STORE_LOCATIONS.find((l) => l.id === id);
    if (!loc) continue;
    const p = map.project([loc.lng, loc.lat]);
    points.set(id, p);
    const host = kept.find((k) => Math.hypot(k.x - p.x, k.y - p.y) < STACK_PX);
    if (host) host.more += 1;
    else kept.push({ id, x: p.x, y: p.y, more: 0 });
  }
  pins.forEach((pin, id) => {
    const k = kept.find((x) => x.id === id);
    pin.dataset.stacked = String(!k);
    pin.dataset.more = String(!!k && k.more > 0);
    pin.tabIndex = k ? 0 : -1;
    const more = pin.querySelector<HTMLElement>('[data-role="more"]');
    if (more) more.textContent = k && k.more ? `+${k.more}` : '';

    const p = points.get(id);
    const card = pin.querySelector<HTMLElement>('[data-role="card"]');
    if (!p || !card) return;
    const half = card.offsetWidth / 2;
    // badge + stem + gap sit ~70px above the point, the card above that
    pin.dataset.below = String(p.y < card.offsetHeight + 80);
    pin.dataset.align = p.x - half < 12 ? 'left' : p.x + half > width - 12 ? 'right' : 'center';
  });
}

function buildOrigin() {
  const root = node('div', 'pointer-events-none relative flex h-5 w-5 items-center justify-center');
  root.dataset.testid = 'nearby-origin';
  root.tabIndex = -1;
  const label = node('span', 'absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap bg-[#171512] px-2 py-1 text-[10px] font-medium text-white');
  root.append(
    node('span', 'absolute inset-0 animate-ping rounded-full bg-[#5A6B4D]/35 motion-reduce:animate-none'),
    node('span', 'relative block h-3.5 w-3.5 rounded-full border-[3px] border-white bg-[#5A6B4D] shadow-[0_2px_8px_rgba(23,21,18,0.35)]'),
    label,
  );
  return { root, label };
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function NearbyStores() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';

  const mapEl = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const pinsRef = useRef(new Map<string, HTMLElement>());
  const originMarker = useRef<{ marker: Marker; label: HTMLSpanElement; root: HTMLDivElement } | null>(null);
  const ringLabels = useRef<Marker[]>([]);
  const cameraRef = useRef<{ center: [number, number]; zoom: number } | null>(null);
  const orderRef = useRef<string[]>(STORE_LOCATIONS.map((l) => l.id));

  const [ready, setReady] = useState(false);
  const [origin, setOrigin] = useState<LatLng>({ lat: MAP_ORIGIN.lat, lng: MAP_ORIGIN.lng });
  const [located, setLocated] = useState(false);
  const [locate, setLocate] = useState<'idle' | 'busy' | 'error' | 'far'>('idle');
  const [openOnly, setOpenOnly] = useState(false);
  const [active, setActive] = useState<string | null>(() => nearestTo(MAP_ORIGIN).id);
  const [hovered, setHovered] = useState<string | null>(null);
  const [center, setCenter] = useState<LatLng>({ lat: MAP_ORIGIN.lat, lng: MAP_ORIGIN.lng });
  const [now, setNow] = useState(() => new Date());
  // which gesture moves the map on this device, for the hint line
  const [gesture] = useState<'touch' | 'mac' | 'pc'>(() =>
    window.matchMedia('(pointer: coarse)').matches ? 'touch' : /Mac|iPhone|iPad/.test(navigator.userAgent) ? 'mac' : 'pc',
  );

  // open/closed is time-dependent; re-check every minute
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const rows = useMemo(
    () =>
      STORE_LOCATIONS.map((loc) => ({ loc, store: storeOf(loc.store), km: distanceKm(origin, loc), open: isOpenNow(loc, now) }))
        .sort((a, b) => a.km - b.km),
    [origin, now],
  );
  const shown = openOnly ? rows.filter((r) => r.open) : rows;

  /** Camera padding: on desktop the index panel covers the start side of the map. */
  const padding = useCallback(
    (extraTop = 0) => {
      const wide = window.matchMedia('(min-width: 1024px)').matches;
      const panel = wide && panelRef.current ? panelRef.current.offsetWidth + 24 : 0;
      const base = wide ? 72 : 28;
      const controls = 56; // zoom column on the end side
      return { top: base + extraTop, bottom: base, left: base + (isAr ? controls : panel), right: base + (isAr ? panel : controls) };
    },
    [isAr],
  );

  const focus = useCallback(
    (id: string, from: LatLng) => {
      const map = mapRef.current;
      const loc = STORE_LOCATIONS.find((l) => l.id === id);
      if (!map || !loc) return;
      map.fitBounds(
        [
          [Math.min(from.lng, loc.lng), Math.min(from.lat, loc.lat)],
          [Math.max(from.lng, loc.lng), Math.max(from.lat, loc.lat)],
        ],
        { padding: padding(90), maxZoom: 14, duration: reducedMotion() ? 0 : 1100 },
      );
    },
    [padding],
  );

  const select = useCallback(
    (id: string) => {
      setActive(id);
      focus(id, origin);
    },
    [focus, origin],
  );

  // pins are plain DOM created once per map; route their clicks to the latest handler
  const selectRef = useRef(select);
  const originRef = useRef(origin);
  useEffect(() => {
    selectRef.current = select;
    originRef.current = origin;
  }, [select, origin]);

  /* ---- the map itself (rebuilt when the language changes) ---- */
  useEffect(() => {
    const container = mapEl.current;
    if (!container) return;
    const start = originRef.current;
    const camera = cameraRef.current;

    const map = new MapLibreMap({
      container,
      style: '/looks/map-style.json',
      ...(camera
        ? { center: camera.center, zoom: camera.zoom }
        : { bounds: box(start, 4.5), fitBoundsOptions: { padding: padding() } }),
      minZoom: 9,
      maxZoom: 16,
      maxBounds: MAP_BOUNDS,
      attributionControl: false,
      cooperativeGestures: true, // the page keeps scrolling; Ctrl/⌘ + scroll zooms, two fingers pan on touch
      locale: isAr ? AR_LOCALE : {},
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
    });
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();
    // attribution on the end side, clear of the index panel
    map.addControl(new AttributionControl({ compact: true }), isAr ? 'bottom-left' : 'bottom-right');

    const pins = pinsRef.current;
    for (const loc of STORE_LOCATIONS) {
      const pin = buildPin(loc, isAr);
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        selectRef.current(loc.id);
      });
      pin.addEventListener('mouseenter', () => setHovered(loc.id));
      pin.addEventListener('mouseleave', () => setHovered(null));
      new Marker({ element: pin, anchor: 'bottom' }).setLngLat([loc.lng, loc.lat]).addTo(map);
      pins.set(loc.id, pin);
    }

    const o = buildOrigin();
    originMarker.current = {
      marker: new Marker({ element: o.root, anchor: 'center' }).setLngLat([start.lng, start.lat]).addTo(map),
      label: o.label,
      root: o.root,
    };

    ringLabels.current = RINGS.map((km) => {
      const label = node('span', 'pointer-events-none bg-[#EEE7DB]/90 px-1.5 text-[10px] font-medium text-neutral-500', isAr ? `${km} كم` : `${km} KM`);
      label.dir = isAr ? 'rtl' : 'ltr';
      label.tabIndex = -1;
      return new Marker({ element: label, anchor: 'center' }).setLngLat(north(start, km)).addTo(map);
    });

    map.on('load', () => {
      map.addSource('nearby-rings', { type: 'geojson', data: ringsData(start) });
      map.addSource('nearby-route', { type: 'geojson', data: lineData([]) });
      map.addLayer({
        id: 'nearby-rings-fill',
        type: 'fill',
        source: 'nearby-rings',
        filter: ['==', ['get', 'km'], RINGS[0]],
        paint: { 'fill-color': OLIVE, 'fill-opacity': 0.06 },
      });
      map.addLayer({
        id: 'nearby-rings-line',
        type: 'line',
        source: 'nearby-rings',
        paint: { 'line-color': INK, 'line-opacity': 0.22, 'line-width': 1, 'line-dasharray': [3, 3] },
      });
      map.addLayer({
        id: 'nearby-route-casing',
        type: 'line',
        source: 'nearby-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#FFFFFF', 'line-width': 5, 'line-opacity': 0.9 },
      });
      map.addLayer({
        id: 'nearby-route',
        type: 'line',
        source: 'nearby-route',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': OLIVE, 'line-width': 2 },
      });
      setReady(true);
    });

    // keep pins from piling up and name cards inside the frame as the camera moves
    const place = () => placePins(map, pins, orderRef.current);
    map.on('move', place);
    map.on('resize', place);

    map.on('moveend', () => {
      const c = map.getCenter();
      cameraRef.current = { center: [c.lng, c.lat], zoom: map.getZoom() };
      setCenter({ lat: c.lat, lng: c.lng });
    });

    mapRef.current = map;
    return () => {
      setReady(false);
      map.remove(); // takes its markers with it
      mapRef.current = null;
      pins.clear();
      originMarker.current = null;
      ringLabels.current = [];
    };
  }, [isAr, padding]);

  /* ---- rings, ring labels and the origin dot follow the starting point ---- */
  useEffect(() => {
    originMarker.current?.marker.setLngLat([origin.lng, origin.lat]);
    ringLabels.current.forEach((m, i) => m.setLngLat(north(origin, RINGS[i])));
    if (!ready) return;
    (mapRef.current?.getSource('nearby-rings') as GeoJSONSource | undefined)?.setData(ringsData(origin));
  }, [origin, ready]);

  useEffect(() => {
    const o = originMarker.current;
    if (!o) return;
    o.label.textContent = located ? (isAr ? 'موقعك' : 'You Are Here') : isAr ? 'جدة' : 'Jeddah';
    o.root.setAttribute('aria-label', o.label.textContent);
  }, [located, isAr, ready]);

  /* ---- pin states mirror the list ---- */
  useEffect(() => {
    const openIds = new Set(rows.filter((r) => r.open).map((r) => r.loc.id));
    pinsRef.current.forEach((pin, id) => {
      pin.dataset.active = String(id === active);
      pin.dataset.hover = String(id === hovered && id !== active);
      pin.dataset.dim = String(openOnly && !openIds.has(id));
      pin.setAttribute('aria-pressed', String(id === active));
      pin.style.zIndex = id === active ? '3' : id === hovered ? '2' : '1';
    });
    // selected store first, then nearest first: that is who stays visible when pins pile up
    orderRef.current = [...(active ? [active] : []), ...rows.map((r) => r.loc.id).filter((id) => id !== active)];
    if (mapRef.current) placePins(mapRef.current, pinsRef.current, orderRef.current);
  }, [active, hovered, openOnly, rows, ready, isAr]);

  /* ---- the arc draws itself from the starting point to the selected store ---- */
  useEffect(() => {
    const src = ready ? (mapRef.current?.getSource('nearby-route') as GeoJSONSource | undefined) : undefined;
    if (!src) return;
    const loc = active ? STORE_LOCATIONS.find((l) => l.id === active) : undefined;
    if (!loc) {
      src.setData(lineData([]));
      return;
    }
    const full = arc(origin, loc);
    if (reducedMotion()) {
      src.setData(lineData(full));
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (ts: number) => {
      const p = Math.min(1, (ts - t0) / 900);
      const eased = 1 - Math.pow(1 - p, 3);
      src.setData(lineData(full.slice(0, Math.max(2, Math.ceil(eased * full.length)))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, origin, ready]);

  /* ---- keep the selected row in view inside the (desktop) panel ---- */
  useEffect(() => {
    const list = listRef.current;
    if (!list || !active || list.scrollHeight <= list.clientHeight) return;
    const row = list.querySelector<HTMLElement>(`[data-row="${active}"]`);
    if (!row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop || bottom > list.scrollTop + list.clientHeight) {
      list.scrollTo({ top: top - 8, behavior: reducedMotion() ? 'auto' : 'smooth' });
    }
  }, [active]);

  const locateMe = () => {
    if (!('geolocation' in navigator)) {
      setLocate('error');
      return;
    }
    setLocate('busy');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const here = { lat: p.coords.latitude, lng: p.coords.longitude };
        if (distanceKm(here, MAP_ORIGIN) > JEDDAH_RADIUS_KM) {
          setLocate('far');
          return;
        }
        setOrigin(here);
        setLocated(true);
        setLocate('idle');
        const nearest = nearestTo(here);
        setActive(nearest.id);
        focus(nearest.id, here);
      },
      () => setLocate('error'),
      { timeout: 10_000, maximumAge: 300_000 },
    );
  };

  const recenter = () =>
    mapRef.current?.fitBounds(box(origin, 4.5), { padding: padding(), duration: reducedMotion() ? 0 : 900 });

  const toggleOpen = () => {
    const next = !openOnly;
    setOpenOnly(next);
    if (next && active && !rows.find((r) => r.loc.id === active)?.open) {
      setActive(rows.find((r) => r.open)?.loc.id ?? null);
    }
  };

  const caps = isAr ? 'tracking-normal' : 'uppercase tracking-[0.2em]';
  const originName = located ? t('your location', 'موقعك') : t('central Jeddah', 'وسط جدة');
  const controls = [
    { id: 'nearby-zoom-in', label: t('Zoom In', 'تكبير'), Icon: Plus, onClick: () => mapRef.current?.zoomIn() },
    { id: 'nearby-zoom-out', label: t('Zoom Out', 'تصغير'), Icon: Minus, onClick: () => mapRef.current?.zoomOut() },
    { id: 'nearby-recenter', label: t('Back to Start', 'العودة لنقطة البداية'), Icon: Crosshair, onClick: recenter },
  ];

  return (
    <section data-testid="nearby-stores" className="border-t py-20 md:py-28" style={{ borderColor: HAIR }}>
      <style>{MAP_CSS}</style>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t('Near You', 'بالقرب منك')} title={t('Stores Near You', 'متاجر قريبة منك')} />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-2">
              <span className="inline-flex items-center gap-2 text-[12px] text-neutral-500">
                <MapPin size={14} strokeWidth={1.5} style={{ color: OLIVE }} />
                {located ? t('Your Location', 'موقعك الحالي') : t(MAP_ORIGIN.label.en, MAP_ORIGIN.label.ar)}
              </span>
              <button
                type="button"
                data-testid="nearby-locate"
                onClick={locateMe}
                disabled={locate === 'busy'}
                className={`inline-flex items-center gap-2.5 border-b pb-1.5 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] disabled:opacity-50 ${caps}`}
                style={{ borderColor: INK }}
              >
                <LocateFixed size={13} strokeWidth={1.5} />
                {locate === 'busy' ? t('Locating…', 'جارٍ تحديد موقعك…') : t('Use My Location', 'استخدم موقعي')}
              </button>
            </div>
          </div>
          {(locate === 'error' || locate === 'far') && (
            <p role="status" className="mt-4 text-[12px] text-neutral-500">
              {locate === 'far'
                ? t('Our stores are in Jeddah for now, so the map stays on the city.', 'فروعنا حالياً في جدة، لذلك تبقى الخريطة على المدينة.')
                : t("We couldn't get your location, so the map stays on Jeddah.", 'تعذّر تحديد موقعك، لذلك تبقى الخريطة على جدة.')}
            </p>
          )}
        </Reveal>

        <div className="relative mt-12 md:mt-16">
          {/* ---- map ---- */}
          <div
            className="relative isolate h-[440px] overflow-hidden border sm:h-[520px] lg:h-[660px]"
            style={{ borderColor: HAIR, backgroundColor: LAND }}
          >
            <div
              ref={mapEl}
              dir="ltr"
              data-nearby-map=""
              data-testid="nearby-map"
              className={`h-full w-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* how to zoom — top-start on small screens, centred on the free part of the map on desktop */}
            <p
              data-testid="nearby-hint"
              className={`pointer-events-none absolute start-4 top-4 z-10 max-w-[calc(100%-5.5rem)] truncate whitespace-nowrap border bg-[#FDFCF9]/90 px-3 py-1.5 text-[10px] text-neutral-500 backdrop-blur-sm lg:start-auto lg:max-w-none lg:-translate-x-1/2 lg:ltr:left-[calc(50%+204px)] lg:rtl:left-[calc(50%-204px)] ${
                isAr ? 'tracking-normal' : 'uppercase tracking-[0.12em]'
              }`}
              style={{ borderColor: HAIR }}
            >
              {gesture === 'touch'
                ? t('Two fingers to move the map', 'استخدم إصبعين لتحريك الخريطة')
                : gesture === 'mac'
                  ? t('⌘ + scroll to zoom', '⌘ + التمرير للتكبير')
                  : t('Ctrl + scroll to zoom', 'Ctrl + التمرير للتكبير')}
            </p>

            <div className="absolute end-4 top-4 z-10 flex flex-col items-end gap-2">
              <div className="pointer-events-none hidden border bg-[#FDFCF9]/90 px-3 py-2 text-end backdrop-blur-sm sm:block" style={{ borderColor: HAIR }}>
                <span className={`block text-[9px] text-neutral-400 ${caps}`}>{t('Map Centre', 'مركز الخريطة')}</span>
                <span
                  dir="ltr"
                  data-testid="nearby-coords"
                  className="mt-1 block font-['Outfit',sans-serif] text-[11px] font-medium tabular-nums tracking-[0.08em] text-[#171512]"
                >
                  {center.lat.toFixed(4)}° · {center.lng.toFixed(4)}°
                </span>
              </div>
              <div className="flex flex-col border bg-white" style={{ borderColor: HAIR }}>
                {controls.map(({ id, label, Icon, onClick }, i) => (
                  <button
                    key={id}
                    type="button"
                    data-testid={id}
                    aria-label={label}
                    title={label}
                    onClick={onClick}
                    className={`flex h-10 w-10 items-center justify-center text-[#171512] transition-colors hover:bg-[#171512] hover:text-white ${i ? 'border-t' : ''}`}
                    style={i ? { borderColor: HAIR } : undefined}
                  >
                    <Icon size={15} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ---- index of locations: floats over the map on desktop, sits under it on touch ---- */}
          <div
            ref={panelRef}
            data-testid="nearby-panel"
            className="flex flex-col border border-t-0 bg-white lg:absolute lg:bottom-6 lg:start-6 lg:top-6 lg:w-[384px] lg:border-t lg:shadow-[0_24px_60px_rgba(23,21,18,0.12)]"
            style={{ borderColor: HAIR }}
          >
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4" style={{ borderColor: HAIR }}>
              <div>
                <p className={eyebrowCls(isAr)}>{t('Nearest First', 'الأقرب أولاً')}</p>
                <p
                  data-testid="nearby-count"
                  className={`mt-1 font-bold ${isAr ? 'text-[15px]' : 'text-[13px] uppercase tracking-[0.18em]'}`}
                >
                  {countLabel(shown.length, isAr)}
                </p>
              </div>
              <button
                type="button"
                data-testid="nearby-open-toggle"
                aria-pressed={openOnly}
                onClick={toggleOpen}
                className={`inline-flex items-center gap-2 border px-3 py-2 text-[11px] font-medium transition-colors ${caps} ${
                  openOnly ? 'border-[#171512] bg-[#171512] text-white' : 'border-[#E8E4DC] text-[#171512] hover:border-[#171512]'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${openOnly ? 'bg-[#A7B894]' : 'bg-[#5A6B4D]'}`} />
                {t('Open Now', 'مفتوح الآن')}
              </button>
            </div>

            <div ref={listRef} className="relative overscroll-contain lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
              {shown.length === 0 ? (
                <p className="px-5 py-10 text-center text-[13px] font-light text-neutral-500">
                  {t('No locations are open right now.', 'لا توجد فروع مفتوحة الآن.')}
                </p>
              ) : (
                <ol className="divide-y divide-[#E8E4DC]">
                  {shown.map(({ loc, store, km, open }) => {
                    const isActive = loc.id === active;
                    return (
                      <li
                        key={loc.id}
                        data-row={loc.id}
                        data-testid={`nearby-row-${loc.id}`}
                        data-active={isActive}
                        className={`relative transition-colors ${isActive ? 'bg-[#F6F3EC]' : ''}`}
                      >
                        <span
                          aria-hidden
                          className={`absolute inset-y-0 start-0 w-[2px] transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                          style={{ backgroundColor: OLIVE }}
                        />
                        <button
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => select(loc.id)}
                          onMouseEnter={() => setHovered(loc.id)}
                          onMouseLeave={() => setHovered(null)}
                          onFocus={() => setHovered(loc.id)}
                          onBlur={() => setHovered(null)}
                          className="flex w-full items-start gap-4 px-5 py-4 text-start transition-colors hover:bg-[#F6F3EC]"
                        >
                          {/* The branch as a place rather than a row: its own
                              photograph, with the monogram kept as the plate it
                              sits on so the row survives a missing image. */}
                          <span
                            dir="ltr"
                            aria-hidden
                            className={`relative flex h-[62px] w-[54px] shrink-0 items-center justify-center overflow-hidden font-['Outfit',sans-serif] text-[12px] font-bold tracking-[0.06em] text-white transition-colors ${
                              isActive ? 'bg-[#5A6B4D]' : 'bg-[#171512]'
                            }`}
                          >
                            {store.initials}
                            <img
                              src={store.cover}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500 ${
                                isActive ? 'opacity-100' : 'opacity-90'
                              }`}
                            />
                            <span
                              className={`absolute inset-0 transition-opacity duration-300 ${
                                isActive ? 'opacity-0' : 'opacity-100 bg-[#171512]/25'
                              }`}
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={`block truncate font-bold ${isAr ? 'text-[14px]' : 'text-[12px] uppercase tracking-[0.16em]'}`}>
                              {t(store.name.en, store.name.ar)}
                            </span>
                            <span className="mt-1 block truncate text-[12px] font-light text-neutral-500">
                              {t(loc.district.en, loc.district.ar)}
                            </span>
                            <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                              <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${open ? '' : 'border border-neutral-400'}`}
                                style={open ? { backgroundColor: OLIVE } : undefined}
                              />
                              <span className={open ? 'font-medium text-[#5A6B4D]' : 'text-neutral-500'}>
                                {open ? t('Open Now', 'مفتوح الآن') : t('Closed Now', 'مغلق الآن')}
                              </span>
                              <span className="text-neutral-300">·</span>
                              <span dir="ltr" className="tabular-nums text-neutral-500">
                                {hh(loc.opens)}–{hh(loc.closes)}
                              </span>
                            </span>
                          </span>
                          <span className="shrink-0 text-end">
                            <span className="block font-['Outfit',sans-serif] text-[22px] font-light leading-none tabular-nums">
                              {fmtKm(km)}
                            </span>
                            <span className={`mt-1.5 block text-[10px] text-neutral-400 ${caps}`}>{t('km', 'كم')}</span>
                          </span>
                        </button>

                        {isActive && (
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-4 pe-5 ps-[76px]">
                            {loc.closedOn !== undefined && (
                              <span className="w-full text-[11px] text-neutral-500">
                                {t(`Closed ${DAYS.en[loc.closedOn]}`, `مغلق يوم ${DAYS.ar[loc.closedOn]}`)}
                              </span>
                            )}
                            <a
                              href={directionsUrl(loc, located ? origin : undefined)}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-testid="nearby-directions"
                              className={`inline-flex items-center gap-2 border-b pb-1.5 text-[11px] font-medium transition-colors hover:text-[#5A6B4D] ${caps}`}
                              style={{ borderColor: INK }}
                            >
                              {t('Directions', 'الاتجاهات')}
                              <ArrowUpRight size={12} strokeWidth={1.5} className={isAr ? '-scale-x-100' : ''} />
                            </a>
                            <ViewMore label={t('Visit Store', 'زيارة المتجر')} to={`${lookBase(1)}/store/${loc.store}`} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            <p className="border-t px-5 py-3 text-[11px] font-light text-neutral-400" style={{ borderColor: HAIR }}>
              {t(`Straight-line distance from ${originName}.`, `المسافة بخط مستقيم من ${originName}.`)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
