/**
 * Under the Self Designer's tool: the design services on offer, and the studios
 * behind them (client note: «سكشن خدمات التصميم وسكشن مقدم الخدمة»).
 */
import { SERVICES, lookBase } from '../lookShared';
import { HAIR, MUTED, OLIVE, ViewMore, useLook } from './ui';
import { CONTAINER } from './kit';
import { providersFor } from './data';
import { SERVICE_CATALOG } from './servicesData';
import { ServiceCard } from './ServiceCard';
import { ProviderCard } from './InfoPages';
import { categoryPath, serviceSlug } from './ServicePage';

const h2 = (isAr: boolean) => `text-[22px] font-extrabold md:text-[26px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`;

export function DesignHelp() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const cat = SERVICES[0]; // Interior Design
  const items = SERVICE_CATALOG.filter((s) => s.category === cat.en).slice(0, 4);
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
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {items.map((s) => (
              <ServiceCard key={s.id} s={s} testId="design-service" />
            ))}
          </div>
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
