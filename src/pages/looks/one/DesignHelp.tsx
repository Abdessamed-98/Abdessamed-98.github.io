/**
 * Under the Self Designer's tool: the design services we sell, and the partners
 * who deliver them (client note: «سكشن خدمات التصميم وسكشن مقدم الخدمة»).
 */
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES, lookBase } from '../lookShared';
import { HAIR, MUTED, OLIVE, TILE, ViewMore, primaryBtnCls, useLook } from './ui';
import { CONTAINER } from './kit';
import { useShell } from './shellContext';
import { SERVICE_GALLERY, providersFor } from './data';
import { ProviderCard } from './InfoPages';
import { categoryPath, serviceSlug, servicePath, subServicesOf } from './ServicePage';

const h2 = (isAr: boolean) => `text-[22px] font-extrabold md:text-[26px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`;

export function DesignHelp() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { openService } = useShell();
  const cat = SERVICES[0]; // Interior Design
  const items = subServicesOf(cat);
  const shots = SERVICE_GALLERY[cat.en] ?? [];
  const pros = providersFor(cat.en);

  return (
    <>
      <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }} data-testid="design-services">
        <div className={CONTAINER}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase" style={{ color: MUTED }}>{t('When the tool is not enough', 'عندما لا تكفي الأداة')}</p>
              <h2 className={`mt-2 ${h2(isAr)}`}>{t('Design services', 'خدمات التصميم')}</h2>
            </div>
            <ViewMore label={t('All design services', 'كل خدمات التصميم')} to={categoryPath(cat)} />
          </div>
          <ul className="scrollbar-hide -mx-6 mt-7 flex snap-x gap-4 overflow-x-auto px-6 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
            {items.map((it, k) => (
              <li key={it.en} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-auto" data-testid="design-service">
                <div className="group flex h-full flex-col border bg-white" style={{ borderColor: HAIR }}>
                  <Link to={servicePath(cat, it)} className="block aspect-[4/3] overflow-hidden" style={{ backgroundColor: TILE }}>
                    <img src={shots[k % Math.max(1, shots.length)]?.img ?? cat.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                  </Link>
                  <div className="flex flex-1 flex-col p-4">
                    <Link to={servicePath(cat, it)} className="text-[15.5px] font-bold leading-snug transition-colors hover:text-[#5A6B4D]">{t(it.en, it.ar)}</Link>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                      <button type="button" onClick={() => openService(`${t(cat.en, cat.ar)} · ${t(it.en, it.ar)}`)} className={`px-4 py-2 ${primaryBtnCls(isAr)}`}>
                        {t('Request', 'اطلب الخدمة')}
                      </button>
                      <Link to={servicePath(cat, it)} aria-label={t('Details', 'التفاصيل')} className="flex h-8 w-8 items-center justify-center border transition-colors hover:bg-[#171512] hover:text-white" style={{ borderColor: '#C9C2B4' }}>
                        <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t py-12 md:py-16" style={{ borderColor: HAIR }} data-testid="design-providers">
        <div className={CONTAINER}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase" style={{ color: OLIVE }}>{t('Verified by Diyar', 'موثّقون من ديار')}</p>
              <h2 className={`mt-2 ${h2(isAr)}`}>{t('Design providers', 'مقدمو خدمات التصميم')}</h2>
            </div>
            <ViewMore label={t('All providers', 'كل مقدمي الخدمات')} to={`${lookBase(1)}/providers?category=${serviceSlug(cat)}`} />
          </div>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pros.map((p) => (
              <li key={p.id}><ProviderCard p={p} /></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
