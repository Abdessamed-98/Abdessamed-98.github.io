/**
 * /look/1/providers — the service partners, the way /stores lists the stores.
 * Providers → their services → a service's page: the same three levels as
 * stores → products → a product (client note on the services hierarchy).
 */
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Briefcase, MapPin, Star } from 'lucide-react';
import { SERVICES, SERVICES_MENU, lookBase } from '../lookShared';
import { Breadcrumb, HAIR, MUTED, OLIVE, TILE, primaryBtnCls, useLook } from './ui';
import { CONTAINER, displayCls } from './kit';
import { useShell } from './shellContext';
import { PROVIDERS } from './data';
import { serviceSlug, servicePath } from './ServicePage';

const home = (t: (en: string, ar: string) => string) => ({ label: t('Home', 'الرئيسية'), to: lookBase(1) });

export default function ProvidersPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { openService } = useShell();
  const [sp, setSp] = useSearchParams();
  const want = sp.get('category') ?? '';
  const cat = SERVICES.find((s) => serviceSlug(s) === want);
  const list = cat ? PROVIDERS.filter((p) => p.service === cat.en) : PROVIDERS;
  // a category's menu items, so an offer's name can be shown in the visitor's language
  const itemOf = (serviceEn: string, itemEn: string) => {
    const i = SERVICES.findIndex((s) => s.en === serviceEn);
    return SERVICES_MENU[i]?.items.find((x) => x.en === itemEn);
  };

  return (
    <main className="pt-[72px]" data-testid="providers-page">
      <div className={`${CONTAINER} pt-8`}>
        <Breadcrumb items={[home(t), { label: t('Services', 'الخدمات'), to: `${lookBase(1)}/services` }, { label: t('Service providers', 'مقدمو الخدمات') }]} />
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className={displayCls(isAr, 'md')}>{t('Service providers', 'مقدمو الخدمات')}</h1>
            <span className="text-[15px]" style={{ color: MUTED }}>{t(`${list.length} partners`, `${list.length} شركاء`)}</span>
          </div>
          <div className="scrollbar-hide -mx-6 flex gap-2 overflow-x-auto px-6 md:-mx-10 md:px-10 lg:mx-0 lg:px-0" role="radiogroup" aria-label={t('Filter by category', 'تصفية حسب القسم')}>
            {[{ key: '', label: t('All', 'الكل') }, ...SERVICES.map((s) => ({ key: serviceSlug(s), label: t(s.en, s.ar) }))].map((c) => {
              const on = want === c.key;
              return (
                <button
                  key={c.key || 'all'}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  data-testid="providers-filter"
                  onClick={() => setSp(c.key ? { category: c.key } : {}, { replace: true })}
                  className={`shrink-0 border px-4 py-2.5 text-[14.5px] transition-colors ${on ? 'border-[#171512] bg-[#171512] font-bold text-white' : 'bg-white font-medium hover:border-[#171512]'}`}
                  style={on ? undefined : { borderColor: '#C9C2B4' }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`${CONTAINER} pb-16 pt-8`}>
        <ul className="grid gap-5 md:grid-cols-2">
          {list.map((p) => {
            const category = SERVICES.find((s) => s.en === p.service);
            return (
              <li key={p.id} className="flex flex-col border bg-white sm:flex-row" style={{ borderColor: HAIR }} data-testid="provider-row">
                <Link to={`${lookBase(1)}/provider/${p.id}`} className="group relative block aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-[38%]" style={{ backgroundColor: TILE }}>
                  <img src={p.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  <span dir="ltr" className="absolute bottom-3 start-3 flex h-10 w-10 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[13px] font-bold text-white">
                    {p.initials}
                  </span>
                </Link>
                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <Link to={`${lookBase(1)}/provider/${p.id}`} className={`block truncate text-[19px] font-extrabold leading-tight transition-colors hover:text-[#5A6B4D] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
                    {t(p.name.en, p.name.ar)}
                  </Link>
                  <p className="mt-1 text-[14px] font-light" style={{ color: '#4A443C' }}>
                    {category ? t(category.en, category.ar) : t(p.trade.en, p.trade.ar)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px]" style={{ color: '#4A443C' }}>
                    <span className="flex items-center gap-1.5 font-bold text-[#171512]">
                      <Star size={13} strokeWidth={1.5} className="fill-[#D9A441] text-[#D9A441]" />
                      {p.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1.5"><Briefcase size={13} strokeWidth={1.5} style={{ color: OLIVE }} />{t(`${p.jobs} jobs`, `${p.jobs} مشروع`)}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} strokeWidth={1.5} style={{ color: OLIVE }} />{t(p.city.en, p.city.ar)}</span>
                  </div>
                  {/* the services they take, each a link to that service's page */}
                  <ul className="mt-4 flex flex-wrap gap-1.5" data-testid="provider-offers">
                    {p.offers.map((en) => {
                      const it = itemOf(p.service, en);
                      if (!it || !category) return null;
                      return (
                        <li key={en}>
                          <Link to={servicePath(category, it)} className="inline-block border px-2.5 py-1 text-[13px] transition-colors hover:border-[#171512] hover:bg-[#171512] hover:text-white" style={{ borderColor: HAIR }}>
                            {t(it.en, it.ar)}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-auto flex items-center gap-3 pt-5">
                    <button type="button" onClick={() => openService(t(p.name.en, p.name.ar))} className={`px-5 py-2.5 ${primaryBtnCls(isAr)}`}>
                      {t('Request a quote', 'اطلب عرض سعر')}
                    </button>
                    <Link to={`${lookBase(1)}/provider/${p.id}`} className="inline-flex items-center gap-1.5 px-2 py-2.5 text-[14px] font-medium transition-colors hover:text-[#5A6B4D]" style={{ color: MUTED }}>
                      {t('Profile', 'الملف')}
                      <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
