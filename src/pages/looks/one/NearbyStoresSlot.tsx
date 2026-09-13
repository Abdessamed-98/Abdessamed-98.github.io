/**
 * Look 1 — lazy slot for the nearby-stores map.
 *
 * The map library is roughly a megabyte and this section sits two-thirds of
 * the way down a very long page, so nothing map-related is downloaded until
 * the visitor scrolls within 600px of it. Until then a quiet placeholder with
 * the same footprint holds the place, so the page does not jump when it loads.
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { HAIR, TILE } from './ui';

const NearbyStores = lazy(() => import('./NearbyStores'));

function Placeholder() {
  return (
    <section
      data-testid="nearby-stores"
      aria-busy="true"
      className="border-t py-20 md:py-28"
      style={{ borderColor: HAIR }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="h-[120px] md:h-[150px]" />
        <div
          className="mt-12 h-[360px] animate-pulse md:mt-16 lg:h-[600px] motion-reduce:animate-none"
          style={{ backgroundColor: TILE }}
        />
      </div>
    </section>
  );
}

export function NearbyStoresSlot() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setNear(true); },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  return (
    <div ref={ref}>
      {near ? (
        <Suspense fallback={<Placeholder />}>
          <NearbyStores />
        </Suspense>
      ) : (
        <Placeholder />
      )}
    </div>
  );
}
