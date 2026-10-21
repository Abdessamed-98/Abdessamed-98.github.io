/**
 * One paid banner, placed before a product or service section. The data is in
 * AD_BANNERS (lookShared); the partner books the slot from the dashboard's
 * «الإعلانات» page. Always marked «إعلان», with the sponsor named.
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AD_BANNERS, type AdSlot } from '../lookShared';
import { HAIR, INK, MUTED, TILE, useLook } from './ui';
import { CONTAINER, capsCls } from './kit';

export function AdBanner({ slot, className = '' }: { slot: AdSlot; className?: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const ad = AD_BANNERS.find((a) => a.slot === slot);
  if (!ad) return null;
  const dark = ad.tone === 'dark';
  return (
    <div className={`${CONTAINER} ${className}`} data-testid={`ad-${slot}`}>
      <Link to={ad.to} className="group grid overflow-hidden border md:grid-cols-12" style={{ borderColor: HAIR }}>
        <span className="relative block aspect-[16/7] md:col-span-5 md:aspect-auto md:min-h-[230px]" style={{ backgroundColor: TILE }}>
          <img src={ad.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        </span>
        <span
          className="flex flex-col justify-center p-6 md:col-span-7 md:p-10"
          style={{ backgroundColor: dark ? INK : '#FFFFFF', color: dark ? '#FFFFFF' : INK }}
        >
          <span className={`flex items-center gap-3 text-[11px] ${capsCls(isAr)}`} style={{ color: dark ? 'rgba(255,255,255,0.7)' : MUTED }}>
            <span className="border px-1.5 py-0.5" style={{ borderColor: dark ? 'rgba(255,255,255,0.4)' : '#C9C2B4' }}>{t('Ad', 'إعلان')}</span>
            {t(ad.sponsor.en, ad.sponsor.ar)}
          </span>
          <span className={`mt-3 text-[22px] font-extrabold leading-tight md:text-[28px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
            {t(ad.title.en, ad.title.ar)}
          </span>
          <span className="mt-3 max-w-xl text-[14.5px] font-light leading-relaxed" style={{ color: dark ? 'rgba(255,255,255,0.8)' : '#4A443C' }}>
            {t(ad.body.en, ad.body.ar)}
          </span>
          <span className={`mt-5 inline-flex items-center gap-2 self-start border-b pb-1 text-[12.5px] font-medium ${capsCls(isAr)}`} style={{ borderColor: dark ? '#FFFFFF' : INK }}>
            {t(ad.cta.en, ad.cta.ar)}
            <ArrowRight size={12} strokeWidth={1.5} className={`transition-transform duration-300 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </span>
        </span>
      </Link>
    </div>
  );
}
