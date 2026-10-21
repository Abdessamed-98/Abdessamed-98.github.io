/**
 * Look 1 — one service (/look/1/services/:id): the product page's twin.
 * Gallery | info | sidebar, then tabs, then similar services from other
 * providers and more from this one. The buy panel becomes the request panel.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Briefcase, CalendarDays, Check, Clock, FileText, MapPin, MessageSquare, ShieldCheck, Star, Wallet } from 'lucide-react';
import { formatSAR, lookBase } from '../lookShared';
import { Breadcrumb, HAIR, INK, MUTED, OLIVE, TILE, Stars, primaryBtnCls, useLook } from './ui';
import { Tabs, capsCls } from './kit';
import { useShell } from './shellContext';
import { NotFoundPage } from './InfoPages';
import { SERVICE_CATALOG, categoryOfService, providerOfService, serviceById, servicesOfProvider, subOfService } from './servicesData';
import { ServiceCard } from './ServiceCard';
import { categoryPath, servicePath, servicePathOf } from './ServicePage';

type InfoTab = 'description' | 'included' | 'how' | 'reviews';

const STEPS = [
  { en: 'Send the request with a few photos', ar: 'أرسل الطلب مع بعض الصور' },
  { en: 'The provider calls to set a visit', ar: 'يتصل مقدم الخدمة لتحديد الزيارة' },
  { en: 'A written quote within one business day', ar: 'عرض سعر مكتوب خلال يوم عمل' },
  { en: 'Work starts on the agreed date, covered by Diyar', ar: 'يبدأ العمل في الموعد المتفق عليه بضمان ديار' },
];

export function ServiceDetail({ id }: { id: string }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { openService } = useShell();
  const [active, setActive] = useState(0);
  const [tab, setTab] = useState<InfoTab>('description');

  const s = serviceById(id);
  if (!s) return <NotFoundPage />;
  const p = providerOfService(s);
  const cat = categoryOfService(s);
  const sub = subOfService(s);
  const name = t(s.name.en, s.name.ar);
  const providerName = p ? t(p.name.en, p.name.ar) : '';
  const gallery = s.gallery.length ? s.gallery : [s.img];
  const similar = SERVICE_CATALOG.filter((x) => x.id !== s.id && x.providerId !== s.providerId && (x.sub === s.sub || x.category === s.category)).slice(0, 4);
  const more = servicesOfProvider(s.providerId).filter((x) => x.id !== s.id).slice(0, 4);
  const card = 'border bg-white';
  // «طلب خدمة»: a direct request to this provider for this service (an open «طلب تنفيذ» lives on the category and catalogue pages)
  const ask = () => openService({ direct: true, category: s.category, sub: s.sub, service: name, provider: providerName || undefined });

  const crumbs = [
    { label: t('Home', 'الرئيسية'), to: lookBase(1) },
    { label: t('Services', 'الخدمات'), to: `${lookBase(1)}/services` },
    ...(cat ? [{ label: t(cat.en, cat.ar), to: categoryPath(cat) }] : []),
    ...(cat && sub ? [{ label: t(sub.en, sub.ar), to: servicePath(cat, sub) }] : []),
    { label: name },
  ];

  return (
    <div data-testid="service-page" className="pt-[72px]">
      <div className="mx-auto max-w-[1480px] px-5 pt-8 md:px-6 md:pt-10">
        <Breadcrumb items={crumbs} />
      </div>

      <div className="mx-auto max-w-[1480px] px-5 pt-8 pb-16 md:px-6 md:pt-10 md:pb-20">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)_minmax(0,3.5fr)] xl:gap-9">
          {/* ---- gallery ---- */}
          <div className="lg:col-span-7 xl:col-span-1" data-testid="service-gallery">
            <div className="flex flex-col-reverse gap-3 lg:flex-row">
              <div className="scrollbar-hide flex gap-3 overflow-x-auto lg:w-[84px] lg:shrink-0 lg:flex-col lg:overflow-visible" role="tablist">
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={t(`Image ${i + 1}`, `الصورة ${i + 1}`)}
                    onClick={() => setActive(i)}
                    className={`relative aspect-square w-[72px] shrink-0 overflow-hidden border transition-colors lg:w-full ${i === active ? 'border-[#171512]' : 'border-[#E8E4DC] hover:border-[#171512]/40'}`}
                    style={{ backgroundColor: TILE }}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="relative aspect-[4/5] min-w-0 flex-1 overflow-hidden" style={{ backgroundColor: TILE }} data-testid="gallery-main">
                <AnimatePresence initial={false}>
                  <motion.img key={gallery[active]} src={gallery[active]} alt={`${name} — ${active + 1}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="absolute inset-0 h-full w-full object-cover" />
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ---- info ---- */}
          <div className="lg:col-span-5 xl:col-span-1" data-testid="service-info">
            <p className={`flex flex-wrap items-center gap-x-2 text-[11.5px] ${caps}`} style={{ color: MUTED }}>
              {cat && <Link to={categoryPath(cat)} className="hover:text-[#171512]">{t(cat.en, cat.ar)}</Link>}
              {sub && cat && (
                <>
                  <span>·</span>
                  <Link to={servicePath(cat, sub)} className="hover:text-[#171512]">{t(sub.en, sub.ar)}</Link>
                </>
              )}
            </p>
            <h1 className={`mt-3 text-[28px] font-extrabold leading-tight md:text-[34px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>{name}</h1>

            {p && (
              <Link to={`${lookBase(1)}/provider/${p.id}`} className="mt-4 flex items-center gap-3 text-[14.5px]" data-testid="service-provider">
                <span dir="ltr" className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[11px] font-bold text-white">{p.initials}</span>
                <span className="font-bold underline-offset-4 hover:underline">{providerName}</span>
                <span style={{ color: MUTED }}>· {t(p.city.en, p.city.ar)}</span>
              </Link>
            )}
            <div className="mt-3 flex items-center gap-2">
              <Stars rating={s.rating} />
              <span className="text-[13px] text-neutral-500">{s.rating.toFixed(1)} ({s.reviews} {t('reviews', 'تقييم')})</span>
            </div>

            {/* price */}
            <div className="mt-6 border-t pt-6" style={{ borderColor: HAIR }}>
              {s.priceFrom ? (
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[14px]" style={{ color: MUTED }}>{t('From', 'ابتداءً من')}</span>
                  <span className="text-[30px] font-extrabold">{formatSAR(s.priceFrom)}</span>
                  <span className="text-[14px]">{t('SAR', 'ر.س')}</span>
                  {s.unit && <span className="text-[14px]" style={{ color: MUTED }}>· {t(s.unit.en, s.unit.ar)}</span>}
                </p>
              ) : (
                <p className="text-[20px] font-extrabold" style={{ color: OLIVE }}>{t('Quoted after a free visit', 'السعر بعرض مكتوب بعد زيارة مجانية')}</p>
              )}
              <p className="mt-2 flex items-center gap-2 text-[14px]" style={{ color: '#4A443C' }}>
                <Clock size={14} strokeWidth={1.5} style={{ color: OLIVE }} />
                {t(s.lead.en, s.lead.ar)}
              </p>
            </div>

            <p className="mt-6 text-[15px] font-light leading-relaxed" style={{ color: '#3F3A33' }}>{t(s.description.en, s.description.ar)}</p>

            <ul className="mt-5 grid gap-2.5" data-testid="service-included">
              {s.included.map((x) => (
                <li key={x.en} className="flex items-start gap-3 text-[14.5px]">
                  <Check size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
                  {t(x.en, x.ar)}
                </li>
              ))}
            </ul>

            {/* request — where the buy panel is on a product */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="button" data-testid="request-service" onClick={ask} className={`flex-1 py-4 ${primaryBtnCls(isAr)}`}>
                {t('Request service', 'طلب خدمة')}
              </button>
              {p && (
                <Link to={`${lookBase(1)}/chat?with=${p.id}`} className="flex flex-1 items-center justify-center gap-2 border py-4 text-[12px] font-medium uppercase transition-colors hover:bg-[#171512] hover:text-white" style={{ borderColor: INK }}>
                  <MessageSquare size={14} strokeWidth={1.5} />
                  {t('Message provider', 'مراسلة المقدم')}
                </Link>
              )}
            </div>
            <p className="mt-3 text-center text-[13px] font-light" style={{ color: MUTED }}>{t(`A quote from ${p?.name.en ?? 'the provider'} within one business day · no obligation`, `عرض سعر من ${p?.name.ar ?? 'مقدم الخدمة'} خلال يوم عمل · دون التزام`)}</p>
          </div>

          {/* ---- sidebar: the provider, the promises, more from them ---- */}
          <aside className="grid gap-5 lg:col-span-12 lg:grid-cols-3 xl:col-span-1 xl:row-span-2 xl:grid-cols-1 xl:content-start" data-testid="service-sidebar">
            {p && (
              <div className={`${card} p-5`} style={{ borderColor: HAIR }} data-testid="provided-by">
                <p className="text-[14px] font-bold">{t('Provided by', 'يقدمها')}</p>
                <div className="mt-4 flex items-center gap-4">
                  <span dir="ltr" className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[15px] font-bold text-white">{p.initials}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[15.5px] font-bold">{providerName}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-neutral-500">
                      <Star size={12} strokeWidth={1.5} className="fill-[#D9A441] text-[#D9A441]" />
                      <span className="font-bold text-[#171512]">{p.rating.toFixed(1)}</span>
                      · <Briefcase size={12} strokeWidth={1.5} /> {t(`${p.jobs} jobs`, `${p.jobs} مشروع`)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-neutral-500">
                      <CalendarDays size={12} strokeWidth={1.5} /> {t(`${p.years} years`, `${p.years} سنوات خبرة`)} · <MapPin size={12} strokeWidth={1.5} /> {t(p.city.en, p.city.ar)}
                    </p>
                  </div>
                </div>
                <Link to={`${lookBase(1)}/provider/${p.id}`} className="mt-5 flex h-11 items-center justify-center gap-2 border text-[14px] font-medium transition-colors hover:bg-[#171512] hover:text-white" style={{ borderColor: INK }}>
                  {t('View profile', 'زيارة الملف')}
                  <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                </Link>
              </div>
            )}

            <ul className={`${card} grid grid-cols-2`} style={{ borderColor: HAIR }} data-testid="service-promises">
              {[
                { icon: FileText, title: t('Written quote', 'عرض سعر مكتوب'), sub: t('Within one business day', 'خلال يوم عمل') },
                { icon: Clock, title: t('Free visit', 'زيارة مجانية'), sub: t('Within 3 days', 'خلال 3 أيام') },
                { icon: ShieldCheck, title: t('Diyar guarantee', 'ضمان ديار'), sub: t('On every job', 'على كل عمل') },
                { icon: Wallet, title: t('Pay through Diyar', 'الدفع عبر ديار'), sub: t('Released on completion', 'يُحوَّل بعد الإنجاز') },
              ].map((row, i) => (
                <li key={row.title} className={`flex flex-col items-center px-3 py-5 text-center ${i % 2 === 0 ? 'border-e' : ''} ${i < 2 ? 'border-b' : ''}`} style={{ borderColor: HAIR }}>
                  <row.icon size={22} strokeWidth={1.3} style={{ color: INK }} />
                  <p className="mt-3 text-[14px] font-bold">{row.title}</p>
                  <p className="mt-1 text-[13px] text-neutral-500">{row.sub}</p>
                </li>
              ))}
            </ul>

            {more.length > 0 && p && (
              <div className={`${card} p-5`} style={{ borderColor: HAIR }} data-testid="more-from-provider">
                <p className={`text-[17px] font-extrabold ${isAr ? "font-['Alexandria',sans-serif]" : ''}`}>{t(`More from ${p.name.en}`, `المزيد من ${p.name.ar}`)}</p>
                <ul className="mt-4 divide-y divide-[#E8E4DC]">
                  {more.slice(0, 3).map((x) => (
                    <li key={x.id}>
                      <Link to={servicePathOf(x)} className="group flex w-full items-center gap-3.5 py-3 text-start">
                        <img src={x.img} alt="" loading="lazy" className="h-14 w-14 shrink-0 object-cover" style={{ backgroundColor: TILE }} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14.5px] font-bold">{t(x.name.en, x.name.ar)}</span>
                          <span className="mt-0.5 block truncate text-[13px] text-neutral-500">
                            {x.priceFrom ? `${t('From', 'من')} ${formatSAR(x.priceFrom)} ${t('SAR', 'ر.س')}` : t('Quote', 'عرض سعر')}
                          </span>
                        </span>
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center border transition-colors group-hover:bg-[#171512] group-hover:text-white" style={{ borderColor: '#C9C2B4' }}>
                          <ArrowRight size={13} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          {/* ---- details as tabs ---- */}
          <section className="lg:col-span-12 xl:col-span-2" data-testid="service-details">
            <Tabs
              testId="service-tabs"
              value={tab}
              onChange={setTab}
              items={[
                { key: 'description', label: t('Description', 'الوصف') },
                { key: 'included', label: t("What's included", 'ما تشمله') },
                { key: 'how', label: t('How it works', 'كيف تسير الخدمة') },
                { key: 'reviews', label: t('Reviews', 'التقييمات'), count: p?.reviews.length },
              ]}
            />
            <div className="pt-8">
              {tab === 'description' && (
                <div className="max-w-3xl">
                  <p className="text-[16px] font-light leading-relaxed" style={{ color: '#3F3A33' }}>{t(s.description.en, s.description.ar)}</p>
                  {p && <p className="mt-5 text-[15px] font-light leading-relaxed" style={{ color: '#3F3A33' }}>{t(p.bio.en, p.bio.ar)}</p>}
                </div>
              )}
              {tab === 'included' && (
                <ul className="grid max-w-3xl gap-x-10 gap-y-4 sm:grid-cols-2">
                  {s.included.map((x) => (
                    <li key={x.en} className="flex items-start gap-3.5">
                      <Check size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" style={{ color: OLIVE }} />
                      <span className="text-[15px] leading-relaxed">{t(x.en, x.ar)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {tab === 'how' && (
                <ol className="grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {STEPS.map((step, i) => (
                    <li key={step.en} className="border-t pt-5" style={{ borderColor: '#17151226' }}>
                      <span className="font-['Outfit',sans-serif] text-[12px] font-medium tracking-[0.2em] text-neutral-400">{String(i + 1).padStart(2, '0')}</span>
                      <p className="mt-2.5 text-[15px] font-bold leading-snug">{t(step.en, step.ar)}</p>
                    </li>
                  ))}
                </ol>
              )}
              {tab === 'reviews' && p && (
                <ul className="grid max-w-4xl gap-5 md:grid-cols-2">
                  {p.reviews.map((r) => (
                    <li key={r.name.en} className="border p-5" style={{ borderColor: HAIR }}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[14.5px] font-bold">{t(r.name.en, r.name.ar)}</p>
                        <Stars rating={r.rating} />
                      </div>
                      <p className="mt-3 text-[15px] font-light leading-relaxed" style={{ color: '#3F3A33' }}>{t(r.text.en, r.text.ar)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ---- similar from other providers; more from this one ---- */}
      {similar.length > 0 && (
        <section className="border-t py-14 md:py-20" style={{ borderColor: HAIR }} data-testid="similar-services">
          <div className="mx-auto max-w-[1480px] px-5 md:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className={`text-[22px] font-extrabold md:text-[26px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
                {t('Similar services from other providers', 'خدمات مشابهة من مقدمين آخرين')}
              </h2>
              {cat && sub && (
                <Link to={servicePath(cat, sub)} className="inline-flex items-center gap-2 border-b pb-1 text-[14px] font-medium transition-colors hover:text-[#5A6B4D]" style={{ borderColor: INK }}>
                  {t(`All ${sub.en}`, `كل ${sub.ar}`)}
                  <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
                </Link>
              )}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {similar.map((x) => (
                <ServiceCard key={x.id} s={x} rail testId="similar-service" />
              ))}
            </div>
          </div>
        </section>
      )}
      {more.length > 0 && p && (
        <section className="pb-20 md:pb-24" data-testid="more-services">
          <div className="mx-auto max-w-[1480px] px-5 md:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className={`text-[22px] font-extrabold md:text-[26px] ${isAr ? "font-['Alexandria',sans-serif]" : "font-['Outfit',sans-serif] uppercase tracking-tight"}`}>
                {t(`More from ${p.name.en}`, `المزيد من ${p.name.ar}`)}
              </h2>
              <Link to={`${lookBase(1)}/provider/${p.id}?tab=services`} className="inline-flex items-center gap-2 border-b pb-1 text-[14px] font-medium transition-colors hover:text-[#5A6B4D]" style={{ borderColor: INK }}>
                {t('All their services', 'كل خدماتهم')}
                <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6">
              {more.map((x) => (
                <ServiceCard key={x.id} s={x} rail />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
