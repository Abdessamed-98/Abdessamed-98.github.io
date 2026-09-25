/**
 * Look 1 — the company side of Diyar: B2B solutions, a fit-out company's
 * profile with its quote request, the projects gallery, about, and contact.
 *
 * The original shows About, Contact and Projects as overlays off the side menu;
 * here they are pages, so they can be linked from the footer and shared.
 */
import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Check, Mail, MapPin, MessageSquare, Phone, Building2, Hotel, Briefcase, Home as HomeIcon } from 'lucide-react';
import { FOOTER_LINKS, IMG, lookBase } from '../lookShared';
import { HAIR, INK, MUTED, NIGHT, OLIVE, OLIVE_LT, TILE, primaryBtnCls, useLook, useSeen } from './ui';
import { useShell } from './shellContext';
import { Sheet } from './Sheet';
import { CONTAINER, Lightbox, PageHead, SelectField, TextArea, TextField, capsCls, displayCls } from './kit';
import { COMPANIES, PROJECTS, type Company } from './data';
import { NotFoundPage } from './InfoPages';

const home = (t: (en: string, ar: string) => string) => ({ label: t('Home', 'الرئيسية'), to: lookBase(1) });

/* ------------------------------------------------------------------ */
/* Quote request — shared by the B2B landing and each company          */
/* ------------------------------------------------------------------ */

function QuoteSheet({ open, onClose, company }: { open: boolean; onClose: () => void; company?: Company }) {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const { toast } = useShell();
  const [f, setF] = useState({
    company: t('Al Rawabi Hotels', 'فنادق الروابي'),
    contact: t('Abdullah Al-Harbi', 'عبدالله الحربي'),
    phone: '0551234567',
    sector: 'hospitality',
    size: '1000',
    brief: t('Fit-out of 48 guest rooms and a lobby lounge, handover in Q2.', 'تجهيز 48 غرفة فندقية وصالة استقبال، التسليم في الربع الثاني.'),
  });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onClose();
    toast(t('Request sent — a project lead will call within one working day.', 'تم إرسال الطلب — سيتصل بك مدير مشروع خلال يوم عمل.'));
  };
  return (
    <Sheet
      open={open}
      onClose={onClose}
      side="end"
      testId="quote-sheet"
      eyebrow={company ? t(company.name.en, company.name.ar) : t('B2B Solutions', 'حلول الشركات')}
      title={t('Request a Quote', 'اطلب عرض سعر')}
      footer={
        <button type="submit" form="quote-form" data-testid="quote-submit" className={`w-full py-4 ${primaryBtnCls(isAr)}`}>
          {t('Send Request', 'إرسال الطلب')}
        </button>
      }
    >
      <form id="quote-form" onSubmit={submit} className="grid gap-5 px-6 py-6">
        <TextField id="q-company" label={t('Company', 'الشركة')} value={f.company} onChange={set('company')} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="q-contact" label={t('Contact person', 'الشخص المسؤول')} value={f.contact} onChange={set('contact')} required />
          <TextField id="q-phone" label={t('Phone', 'رقم الجوال')} value={f.phone} onChange={set('phone')} ltr inputMode="tel" required />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id="q-sector"
            label={t('Project type', 'نوع المشروع')}
            value={f.sector}
            onChange={set('sector')}
            options={[
              { value: 'hospitality', label: t('Hotel or restaurant', 'فندق أو مطعم') },
              { value: 'office', label: t('Office', 'مكاتب') },
              { value: 'residential', label: t('Residential development', 'مشروع سكني') },
              { value: 'retail', label: t('Retail', 'متاجر') },
            ]}
          />
          <SelectField
            id="q-size"
            label={t('Area', 'المساحة')}
            value={f.size}
            onChange={set('size')}
            options={[
              { value: '300', label: t('Up to 300 m²', 'حتى 300 م²') },
              { value: '1000', label: t('300 – 1,000 m²', '300 – 1,000 م²') },
              { value: '5000', label: t('1,000 – 5,000 m²', '1,000 – 5,000 م²') },
              { value: 'more', label: t('Over 5,000 m²', 'أكثر من 5,000 م²') },
            ]}
          />
        </div>
        <TextArea id="q-brief" label={t('The brief', 'وصف المشروع')} value={f.brief} onChange={set('brief')} rows={5} />
      </form>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/* B2B landing                                                         */
/* ------------------------------------------------------------------ */

export function B2BPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const [quote, setQuote] = useState(false);
  const sectors = useSeen<HTMLUListElement>(0.2);

  const SECTORS = [
    { icon: Hotel, title: t('Hospitality', 'الضيافة'), body: t('Hotels, restaurants, lounges — FF&E to handover.', 'فنادق ومطاعم وصالات — من التجهيزات حتى التسليم.'), img: IMG.restaurant },
    { icon: Briefcase, title: t('Workspaces', 'بيئات العمل'), body: t('Offices planned around how teams work.', 'مكاتب مخططة حول طريقة عمل الفرق.'), img: IMG.catOffice },
    { icon: Building2, title: t('Developments', 'المشاريع السكنية'), body: t('Furnished units at scale, to schedule.', 'وحدات مؤثثة بالجملة وفي موعدها.'), img: IMG.bedroom },
    { icon: HomeIcon, title: t('Private villas', 'الفلل الخاصة'), body: t('Whole-house fit-out under one contract.', 'تجهيز منزل كامل بعقد واحد.'), img: '/looks/campaign-majlis.webp' },
  ];

  return (
    <main className="pt-[72px]" data-testid="b2b-page">
      {/* hero */}
      <div className="relative min-h-[520px] overflow-hidden md:h-[72vh]" style={{ backgroundColor: INK }}>
        <img src={IMG.loungeDark} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="relative flex h-full min-h-[520px] items-end">
          <div className={`${CONTAINER} w-full pb-12 md:pb-16`}>
            <p className={`text-[11px] text-white/80 ${caps}`}>{t('B2B Solutions', 'حلول الشركات')}</p>
            <h1 className={`mt-5 max-w-3xl text-white ${displayCls(isAr, 'xl')}`}>
              {t('Design, build and deliver — one contract', 'نصمّم وننفّذ ونسلّم — بعقد واحد')}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-white/80">
              {t(
                'From a single floor to three hundred apartments, Diyar runs the project: drawings, manufacture, supply and installation.',
                'من طابق واحد إلى ثلاثمئة شقة، تدير ديار المشروع: المخططات والتصنيع والتوريد والتركيب.',
              )}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button type="button" data-testid="b2b-quote" onClick={() => setQuote(true)} className={`px-9 py-4 ${primaryBtnCls(isAr)} !bg-white !text-[#171512] hover:!bg-[#5A6B4D] hover:!text-white`}>
                {t('Request a Quote', 'اطلب عرض سعر')}
              </button>
              <Link to={`${lookBase(1)}/projects`} className={`inline-flex items-center gap-2 border border-white/60 px-8 py-4 text-[11px] font-medium text-white transition-colors hover:bg-white hover:text-[#171512] ${caps}`}>
                {t('See Our Projects', 'شاهد مشاريعنا')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* numbers */}
      <div className="border-b" style={{ borderColor: HAIR, backgroundColor: TILE }}>
        <ul className={`${CONTAINER} grid grid-cols-2 md:grid-cols-4`}>
          {[
            [t('Projects delivered', 'مشروع منجز'), '400+'],
            [t('Units furnished', 'وحدة مؤثثة'), '3,200'],
            [t('Partner workshops', 'ورشة شريكة'), '38'],
            [t('On-time handover', 'تسليم في الموعد'), '96%'],
          ].map(([label, value]) => (
            <li key={label} className="py-7 text-center">
              <p className="font-['Outfit',sans-serif] text-[30px] font-bold tabular-nums md:text-[36px]" dir="ltr">{value}</p>
              <p className={`mt-1 text-[10px] ${caps}`} style={{ color: MUTED }}>{label}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* sectors */}
      <section className={`${CONTAINER} py-14 md:py-20`}>
        <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Who we build for', 'لمن ننفّذ')}</p>
        <h2 className={`mt-3 ${displayCls(isAr, 'md')}`}>{t('Four kinds of project', 'أربعة أنواع من المشاريع')}</h2>
        <ul ref={sectors.ref} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={false}
              animate={sectors.seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: TILE }}>
                <img src={s.img} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 flex items-center gap-2.5">
                <s.icon size={16} strokeWidth={1.5} style={{ color: OLIVE }} />
                <p className="text-[15px] font-bold">{s.title}</p>
              </div>
              <p className="mt-2 text-[13px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{s.body}</p>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* companies */}
      <section className="border-t py-14 md:py-20" style={{ borderColor: HAIR }}>
        <div className={CONTAINER}>
          <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Fit-out partners', 'شركاء التجهيز')}</p>
          <h2 className={`mt-3 ${displayCls(isAr, 'md')}`}>{t('The companies behind the work', 'الشركات خلف الأعمال')}</h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {COMPANIES.map((c) => (
              <li key={c.id}>
                <Link to={`${lookBase(1)}/b2b/${c.id}`} className="group block border transition-colors hover:border-[#171512]" style={{ borderColor: HAIR }} data-testid="company-card">
                  <div className="aspect-[16/10] overflow-hidden" style={{ backgroundColor: TILE }}>
                    <img src={c.cover} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex items-start gap-4 p-5">
                    <span dir="ltr" className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#171512] font-['Outfit',sans-serif] text-[12px] font-bold text-white">{c.initials}</span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold">{t(c.name.en, c.name.ar)}</span>
                      <span className="mt-1 block text-[12px] font-light" style={{ color: MUTED }}>{t(c.sector.en, c.sector.ar)}</span>
                      <span className="mt-3 block text-[11px]" style={{ color: MUTED }}>
                        {t(`${c.stats.projects} projects · ${c.stats.years} years`, `${c.stats.projects} مشروع · ${c.stats.years} سنة`)}
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* process */}
      <section style={{ backgroundColor: NIGHT }}>
        <div className={`${CONTAINER} grid gap-10 py-14 md:py-20 lg:grid-cols-12`}>
          <div className="lg:col-span-4">
            <p className={`text-[10px] ${caps}`} style={{ color: OLIVE_LT }}>{t('The process', 'آلية العمل')}</p>
            <h2 className={`mt-3 text-white ${displayCls(isAr, 'md')}`}>{t('One team from brief to keys', 'فريق واحد من الفكرة حتى التسليم')}</h2>
            <button type="button" onClick={() => setQuote(true)} className={`mt-8 px-9 py-4 ${primaryBtnCls(isAr)} !bg-white !text-[#171512] hover:!bg-[#5A6B4D] hover:!text-white`}>
              {t('Start a Project', 'ابدأ مشروعك')}
            </button>
          </div>
          <ol className="grid gap-px sm:grid-cols-2 lg:col-span-8" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            {[
              [t('Brief & survey', 'الفكرة والمعاينة'), t('We visit, measure and agree the scope.', 'نزور ونقيس ونتفق على النطاق.')],
              [t('Design & costing', 'التصميم والتسعير'), t('Drawings, samples and a fixed price.', 'مخططات وعينات وسعر ثابت.')],
              [t('Manufacture & supply', 'التصنيع والتوريد'), t('Made in partner workshops, tracked weekly.', 'تصنيع في ورش شريكة ومتابعة أسبوعية.')],
              [t('Install & hand over', 'التركيب والتسليم'), t('Our crews install; you sign off room by room.', 'فرقنا تركّب، وتستلم غرفة غرفة.')],
            ].map(([title, body], i) => (
              <li key={title} className="p-7" style={{ backgroundColor: NIGHT }}>
                <span className="font-['Outfit',sans-serif] text-[28px] font-bold" style={{ color: OLIVE_LT }} dir="ltr">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-4 text-[15px] font-bold text-white">{title}</p>
                <p className="mt-2 text-[13px] font-light leading-relaxed text-white/65">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <QuoteSheet open={quote} onClose={() => setQuote(false)} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Company profile                                                     */
/* ------------------------------------------------------------------ */

export function CompanyPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const { id = '' } = useParams();
  const [quote, setQuote] = useState(false);
  const [shown, setShown] = useState<number | null>(null);
  const c = COMPANIES.find((x) => x.id === id);
  if (!c) return <NotFoundPage />;

  return (
    <main className="pt-[72px]" data-testid="company-page">
      <PageHead
        crumbs={[home(t), { label: t('B2B Solutions', 'حلول الشركات'), to: `${lookBase(1)}/b2b` }, { label: t(c.name.en, c.name.ar) }]}
        eyebrow={t(c.sector.en, c.sector.ar)}
        title={t(c.name.en, c.name.ar)}
        intro={t(c.about.en, c.about.ar)}
        aside={
          <button type="button" data-testid="company-quote" onClick={() => setQuote(true)} className={`px-9 py-4 ${primaryBtnCls(isAr)}`}>
            {t('Request a Quote', 'اطلب عرض سعر')}
          </button>
        }
      />

      <div className={`${CONTAINER} pt-10`}>
        <div className="aspect-[21/9] overflow-hidden" style={{ backgroundColor: TILE }}>
          <img src={c.cover} alt="" className="h-full w-full object-cover" />
        </div>
        <ul className="grid grid-cols-3 border-b" style={{ borderColor: HAIR }}>
          {[
            [t('Years', 'سنوات'), c.stats.years],
            [t('Projects', 'مشاريع'), c.stats.projects],
            [t('Team', 'فريق العمل'), c.stats.team],
          ].map(([label, value]) => (
            <li key={String(label)} className="py-7 text-center">
              <p className="font-['Outfit',sans-serif] text-[28px] font-bold tabular-nums md:text-[34px]">{value}</p>
              <p className={`mt-1 text-[10px] ${caps}`} style={{ color: MUTED }}>{label}</p>
            </li>
          ))}
        </ul>
      </div>

      <section className={`${CONTAINER} grid gap-12 py-14 md:py-16 lg:grid-cols-12`}>
        <div className="lg:col-span-4">
          <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Capabilities', 'القدرات')}</p>
          <ul className="mt-5 grid gap-3">
            {c.capabilities.map((cap) => (
              <li key={cap.en} className="flex items-center gap-3 text-[14px] font-medium">
                <Check size={15} strokeWidth={2} style={{ color: OLIVE }} />
                {t(cap.en, cap.ar)}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-8">
          <p className={`text-[10px] ${caps}`} style={{ color: MUTED }}>{t('Selected projects', 'مشاريع مختارة')}</p>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {c.projects.map((pr, i) => (
              <li key={pr.title.en}>
                <button type="button" onClick={() => setShown(i)} className="group block w-full text-start">
                  <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: TILE }}>
                    <img src={pr.img} alt="" loading="lazy" className="h-full w-full cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <p className="mt-3 text-[14px] font-bold">{t(pr.title.en, pr.title.ar)}</p>
                  <p className="mt-1 text-[12px] font-light" style={{ color: MUTED }}>{t(pr.place.en, pr.place.ar)}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Lightbox
        images={c.projects.map((p) => p.img)}
        index={shown ?? 0}
        onIndex={setShown}
        open={shown !== null}
        onClose={() => setShown(null)}
        caption={(i) => `${t(c.projects[i].title.en, c.projects[i].title.ar)} — ${t(c.projects[i].place.en, c.projects[i].place.ar)}`}
      />
      <QuoteSheet open={quote} onClose={() => setQuote(false)} company={c} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export function ProjectsPage() {
  const { lang, t } = useLook();
  const [shown, setShown] = useState<number | null>(null);
  const grid = useSeen<HTMLUListElement>(0.15);
  const caps = capsCls(lang === 'ar');
  return (
    <main className="pt-[72px]" data-testid="projects-page">
      <PageHead
        crumbs={[home(t), { label: t('Projects', 'المشاريع') }]}
        eyebrow={t('Our work', 'أعمالنا')}
        title={t('Rooms we have finished', 'مساحات أنجزناها')}
        intro={t('Homes, majlis and hospitality projects across the Kingdom.', 'منازل ومجالس ومشاريع ضيافة في أنحاء المملكة.')}
      />
      <div className={`${CONTAINER} py-12 md:py-16`}>
        <ul ref={grid.ref} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <motion.li
              key={p.title.en}
              initial={false}
              animate={grid.seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 + Math.floor(i / 3) * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className={i === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
            >
              <button type="button" onClick={() => setShown(i)} className="group relative block h-full w-full overflow-hidden text-start" data-testid="project-tile">
                <img src={p.img} alt="" loading="lazy" className={`w-full cursor-zoom-in object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04] ${i === 0 ? 'aspect-[4/3] h-full' : 'aspect-[4/3]'}`} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16 text-white">
                  <span className="block text-[15px] font-bold">{t(p.title.en, p.title.ar)}</span>
                  <span className={`mt-1 block text-[10px] text-white/75 ${caps}`}>{t(p.place.en, p.place.ar)}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
      <Lightbox
        images={PROJECTS.map((p) => p.img)}
        index={shown ?? 0}
        onIndex={setShown}
        open={shown !== null}
        onClose={() => setShown(null)}
        caption={(i) => `${t(PROJECTS[i].title.en, PROJECTS[i].title.ar)} — ${t(PROJECTS[i].place.en, PROJECTS[i].place.ar)}`}
      />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function AboutPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const VALUES = [
    [t('One guarantee', 'ضمان واحد'), t('Whoever the seller is, Diyar stands behind the order.', 'أياً كان البائع، ديار تضمن الطلب.')],
    [t('Made here', 'صُنع هنا'), t('Most of what we sell is made in Saudi workshops.', 'معظم ما نبيعه يُصنع في ورش سعودية.')],
    [t('Installed by us', 'نركّبه بأنفسنا'), t('Our own crews deliver and assemble.', 'فرقنا توصل وتجمّع.')],
  ];
  return (
    <main className="pt-[72px]" data-testid="about-page">
      <PageHead
        crumbs={[home(t), { label: t('About Us', 'من نحن') }]}
        eyebrow={t('About Diyar', 'عن ديار')}
        title={t('Furniture, design and the people who fit it', 'الأثاث والتصميم ومن يركّبه')}
      />
      <section className={`${CONTAINER} grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-16`}>
        <div className="aspect-[4/5] overflow-hidden lg:col-span-5" style={{ backgroundColor: TILE }}>
          <img src={IMG.workshop} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="lg:col-span-7 lg:pt-8">
          <p className="text-[20px] font-light leading-relaxed md:text-[24px]">{t(FOOTER_LINKS.about, FOOTER_LINKS.aboutAr)}</p>
          <p className="mt-6 text-[15px] font-light leading-relaxed" style={{ color: '#4A443C' }}>
            {t(
              'We started as a furniture showroom in Jeddah and grew into a marketplace: stores, workshops and service partners, held to one standard and one guarantee.',
              'بدأنا معرضاً للأثاث في جدة وكبرنا لنصبح منصة: متاجر وورش وشركاء خدمات، بمعيار واحد وضمان واحد.',
            )}
          </p>
          <ul className="mt-10 grid gap-px sm:grid-cols-3" style={{ backgroundColor: HAIR }}>
            {VALUES.map(([title, body]) => (
              <li key={title} className="bg-[#FDFCF9] p-6">
                <p className="text-[15px] font-bold">{title}</p>
                <p className="mt-2 text-[13px] font-light leading-relaxed" style={{ color: '#4A443C' }}>{body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link to={`${lookBase(1)}/projects`} className={`inline-flex items-center gap-2 border-b pb-1.5 text-[11px] font-medium ${caps}`} style={{ borderColor: INK }}>
              {t('See our projects', 'شاهد مشاريعنا')}
              <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
            </Link>
            <Link to={`${lookBase(1)}/contact`} className={`inline-flex items-center gap-2 border-b pb-1.5 text-[11px] font-medium ${caps}`} style={{ borderColor: INK }}>
              {t('Contact us', 'تواصل معنا')}
              <ArrowRight size={12} strokeWidth={1.5} className={isAr ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export function ContactPage() {
  const { lang, t } = useLook();
  const isAr = lang === 'ar';
  const caps = capsCls(isAr);
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({
    name: t('Abdullah Al-Harbi', 'عبدالله الحربي'),
    phone: '0551234567',
    topic: 'order',
    message: t('I would like to change the delivery time of my order.', 'أرغب في تغيير موعد توصيل طلبي.'),
  });
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });

  const channels = [
    { icon: Phone, label: t('Call', 'اتصل'), value: FOOTER_LINKS.phone, href: `tel:${FOOTER_LINKS.phone.replace(/\s/g, '')}`, ltr: true },
    { icon: Mail, label: t('Email', 'البريد'), value: FOOTER_LINKS.email, href: `mailto:${FOOTER_LINKS.email}`, ltr: true },
    { icon: MessageSquare, label: t('Chat', 'المحادثة'), value: t('Replies in minutes', 'رد خلال دقائق'), to: `${lookBase(1)}/chat` },
    { icon: MapPin, label: t('Showroom', 'المعرض'), value: t('Al Rawdah, Jeddah · 10:00–23:00', 'حي الروضة، جدة · 10:00–23:00') },
  ];

  return (
    <main className="pt-[72px]" data-testid="contact-page">
      <PageHead crumbs={[home(t), { label: t('Contact Us', 'اتصل بنا') }]} eyebrow={t('Contact', 'تواصل معنا')} title={t('We answer, every day', 'نرد عليك، كل يوم')} />
      <section className={`${CONTAINER} grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-16`}>
        <ul className="grid content-start gap-3 lg:col-span-5">
          {channels.map((c) => {
            const body = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border" style={{ borderColor: HAIR }}>
                  <c.icon size={16} strokeWidth={1.5} style={{ color: OLIVE }} />
                </span>
                <span className="min-w-0">
                  <span className={`block text-[10px] ${caps}`} style={{ color: MUTED }}>{c.label}</span>
                  <span className="mt-1 block truncate text-[14px] font-bold" dir={c.ltr ? 'ltr' : undefined}>{c.value}</span>
                </span>
              </>
            );
            const cls = 'flex items-center gap-4 border p-4 transition-colors hover:border-[#171512]';
            return (
              <li key={c.label}>
                {c.href ? (
                  <a href={c.href} className={cls} style={{ borderColor: HAIR }}>{body}</a>
                ) : c.to ? (
                  <Link to={c.to} className={cls} style={{ borderColor: HAIR }}>{body}</Link>
                ) : (
                  <div className={cls} style={{ borderColor: HAIR }}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="lg:col-span-7">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center border px-6 py-16 text-center" style={{ borderColor: HAIR, backgroundColor: TILE }} data-testid="contact-sent">
              <span className="flex h-12 w-12 items-center justify-center" style={{ backgroundColor: OLIVE }}>
                <Check size={20} strokeWidth={2} className="text-white" />
              </span>
              <p className="mt-6 text-[18px] font-bold">{t('Message received', 'وصلتنا رسالتك')}</p>
              <p className="mt-2 text-[14px] font-light" style={{ color: '#4A443C' }}>{t('We will reply within a few hours.', 'سنرد عليك خلال ساعات.')}</p>
              <button type="button" onClick={() => setSent(false)} className={`mt-8 border-b pb-1 text-[11px] font-medium ${caps}`} style={{ borderColor: INK }}>
                {t('Send another', 'أرسل رسالة أخرى')}
              </button>
            </div>
          ) : (
            <form
              data-testid="contact-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="grid gap-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField id="c-name" label={t('Name', 'الاسم')} value={f.name} onChange={set('name')} required />
                <TextField id="c-phone" label={t('Phone', 'رقم الجوال')} value={f.phone} onChange={set('phone')} ltr inputMode="tel" required />
              </div>
              <SelectField
                id="c-topic"
                label={t('About', 'الموضوع')}
                value={f.topic}
                onChange={set('topic')}
                options={[
                  { value: 'order', label: t('An order', 'طلب') },
                  { value: 'service', label: t('A service', 'خدمة') },
                  { value: 'partner', label: t('Selling on Diyar', 'البيع على ديار') },
                  { value: 'other', label: t('Something else', 'موضوع آخر') },
                ]}
              />
              <TextArea id="c-message" label={t('Message', 'الرسالة')} value={f.message} onChange={set('message')} rows={6} required />
              <button type="submit" data-testid="contact-submit" className={`justify-self-start px-10 py-4 ${primaryBtnCls(isAr)}`}>
                {t('Send Message', 'إرسال الرسالة')}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
