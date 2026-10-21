/**
 * The advertising banners: a slider of image banners on the home page, after
 * the brands strip and before «تصفّح الأقسام» (client note). Each banner is one
 * picture made by the advertiser, with its words already in it, and a link.
 * The data is AD_BANNERS (lookShared); partners book a banner from the
 * dashboard's «الإعلانات» page.
 */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { AD_BANNERS } from '../lookShared';
import { TILE, useLook } from './ui';
import { CONTAINER } from './kit';

const EVERY = 5000;

export function AdBannerSlider() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const still = useReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const n = AD_BANNERS.length;

  const go = (k: number, smooth = true) => {
    const el = track.current;
    if (!el || !n) return;
    const to = ((k % n) + n) % n;
    const first = el.children[0] as HTMLElement;
    const child = el.children[to] as HTMLElement;
    // offsetLeft difference is signed the right way in both directions
    el.scrollTo({ left: child.offsetLeft - first.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
  };

  // which banner is in view, from the scroll position (swiping, arrows and autoplay all end here)
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setI(Math.min(n - 1, Math.round(Math.abs(el.scrollLeft) / Math.max(1, el.clientWidth))));
  };

  useEffect(() => {
    if (still || hold || n < 2) return;
    const id = window.setInterval(() => go(i + 1), EVERY);
    return () => window.clearInterval(id);
  });

  if (!n) return null;
  const arrow = 'absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-white/90 text-[#171512] shadow-sm transition-colors hover:bg-[#171512] hover:text-white md:flex';

  return (
    <section data-testid="ad-banners" className={`${CONTAINER} pb-4 pt-10 md:pt-12`} aria-label={t('Advertisements', 'إعلانات')}>
      <div className="relative" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
        <ul
          ref={track}
          onScroll={onScroll}
          className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
          style={{ backgroundColor: TILE }}
        >
          {AD_BANNERS.map((ad, k) => (
            <li key={ad.id} className="w-full shrink-0 snap-start" data-testid="ad-banner" aria-hidden={k !== i}>
              <Link to={ad.to} tabIndex={k === i ? 0 : -1} className="block">
                <picture>
                  {ad.imgMobile && <source media="(max-width: 767px)" srcSet={ad.imgMobile} />}
                  <img
                    src={ad.img}
                    alt={t(ad.alt.en, ad.alt.ar)}
                    loading={k === 0 ? 'eager' : 'lazy'}
                    draggable={false}
                    className="block aspect-[4/3] w-full object-cover md:aspect-[24/7]"
                  />
                </picture>
              </Link>
            </li>
          ))}
        </ul>

        {n > 1 && (
          <>
            <button type="button" aria-label={t('Previous', 'السابق')} onClick={() => go(i - 1)} className={`${arrow} start-4`}>
              {isAr ? <ChevronRight size={18} strokeWidth={1.5} /> : <ChevronLeft size={18} strokeWidth={1.5} />}
            </button>
            <button type="button" aria-label={t('Next', 'التالي')} onClick={() => go(i + 1)} className={`${arrow} end-4`}>
              {isAr ? <ChevronLeft size={18} strokeWidth={1.5} /> : <ChevronRight size={18} strokeWidth={1.5} />}
            </button>
            <div className="absolute bottom-3 start-1/2 flex -translate-x-1/2 gap-1.5 rtl:translate-x-1/2" data-testid="ad-dots">
              {AD_BANNERS.map((ad, k) => (
                <button
                  key={ad.id}
                  type="button"
                  aria-label={t(`Banner ${k + 1}`, `البانر ${k + 1}`)}
                  aria-current={k === i}
                  onClick={() => go(k)}
                  className={`h-1.5 transition-all duration-300 ${k === i ? 'w-7 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
