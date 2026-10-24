/**
 * A service in a grid — the product card's twin. Same tile, same eyebrow
 * (the provider where the store would be), same name, stars and price row;
 * «اطلب الخدمة» where «أضف إلى السلة» sits.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { formatSAR, lookBase } from '../lookShared';
import { OLIVE, RED, Stars, eyebrowCls, useLook } from './ui';
import { useShell } from './shellContext';
import { categoryOfService, providerOfService, type ServiceItem } from './servicesData';
import { categoryPathOf, servicePathOf } from './ServicePage';

export function ServiceCard({ s, rail = false, testId }: { s: ServiceItem; rail?: boolean; testId?: string; key?: string | number }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { openService } = useShell();
  const p = providerOfService(s);
  const cat = categoryOfService(s);
  const to = servicePathOf(s);
  const [asked, setAsked] = useState(false);
  const name = t(s.name.en, s.name.ar);

  const ask = () => {
    openService({ category: s.category, service: p ? `${name} — ${t(p.name.en, p.name.ar)}` : name });
    setAsked(true);
    window.setTimeout(() => setAsked(false), 1600);
  };

  return (
    <div className="group flex h-full flex-col" data-testid={testId}>
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute start-4 top-4 z-10 flex flex-col gap-1.5">
          {s.popular && (
            <span className={`text-[11px] font-semibold uppercase text-white drop-shadow ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}>
              {t('Most booked', 'الأكثر طلباً')}
            </span>
          )}
          {s.isNew && (
            <span className={`text-[11px] font-semibold uppercase text-white drop-shadow ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}>
              {t('New', 'جديد')}
            </span>
          )}
        </div>
        <Link to={to} className="block h-full w-full" aria-label={name}>
          <img src={s.img} alt={name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        </Link>
      </div>

      {/* the provider, where the store sits on a product */}
      <p className={`mt-5 flex items-center gap-2 ${eyebrowCls(isAr, 'text-[11.5px] text-neutral-500')}`}>
        {p && (
          <span dir="ltr" className="flex h-4 min-w-4 shrink-0 items-center justify-center bg-[#171512] px-0.5 font-['Outfit',sans-serif] text-[8px] font-bold leading-none text-white">
            {p.initials}
          </span>
        )}
        {p ? (
          <Link to={`${lookBase(1)}/provider/${p.id}`} className="truncate underline-offset-4 hover:underline">
            {t(p.name.en, p.name.ar)}
          </Link>
        ) : null}
      </p>
      <h3 className="mt-1.5 truncate text-[15.5px] font-semibold" title={name}>
        <Link to={to} className="decoration-[#5A6B4D] underline-offset-4 hover:underline">
          {name}
        </Link>
      </h3>
      <div className="mt-2 flex items-center gap-2">
        <Stars rating={s.rating} />
        <span className="text-[13px] text-neutral-500">({s.reviews})</span>
      </div>

      {/* price row: from-price and its unit, or a quote */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2 overflow-hidden">
          {s.priceFrom ? (
            <>
              <span className="shrink-0 text-[12px] text-neutral-500">{t('From', 'من')}</span>
              <span className="text-[17px] font-bold">{formatSAR(s.priceFrom)}</span>
              <span className={`text-[12px] uppercase text-neutral-500 ${isAr ? 'tracking-normal' : 'tracking-[0.1em]'}`}>
                {t('SAR', 'ر.س')}
                {s.unit && <span className="normal-case tracking-normal"> · {t(s.unit.en, s.unit.ar)}</span>}
              </span>
            </>
          ) : (
            <span className="text-[14px] font-bold" style={{ color: OLIVE }}>{t('Quote after a free visit', 'عرض سعر بعد زيارة مجانية')}</span>
          )}
        </div>
        {cat && (
          <Link
            to={categoryPathOf(s.category)}
            className={`shrink-0 truncate text-[12px] font-semibold uppercase leading-none underline-offset-4 hover:underline ${isAr ? 'tracking-normal' : 'tracking-[0.2em]'}`}
            style={{ color: RED }}
          >
            {t(cat.en, cat.ar)}
          </Link>
        )}
      </div>

      {!rail && (
        <button
          type="button"
          onClick={ask}
          data-testid="service-card-request"
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 border border-[#171512] py-3.5 text-[12px] font-medium uppercase transition-colors duration-300 ${
            asked ? 'border-[#5A6B4D] bg-[#5A6B4D] text-white' : 'hover:bg-[#171512] hover:text-white'
          } ${isAr ? 'tracking-normal' : 'tracking-[0.28em]'}`}
        >
          {asked && <Check size={13} strokeWidth={2} />}
          {t('Request execution', 'طلب تنفيذ')}
        </button>
      )}
    </div>
  );
}
