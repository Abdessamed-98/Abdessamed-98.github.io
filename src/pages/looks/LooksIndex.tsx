/**
 * Chooser page for the 3 redesign directions — this is the link sent to the client.
 * Arabic-first (the site's primary language), with a working ENG | عربي toggle
 * shared with the look pages via localStorage('diyar-look-lang').
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { IMG, type Lang } from './lookShared.tsx';

const LOOKS = [
  {
    to: '/look/1',
    num: '01',
    name: 'Editorial Light',
    nameAr: 'إيديتوريال فاتح',
    desc: 'Gallery-white canvas, bold uppercase titles, olive accents — the closest match to the reference direction.',
    descAr: 'خلفية بيضاء دافئة وعناوين كبيرة بارزة ولمسات زيتونية — الأقرب إلى الاتجاه المرجعي.',
    img: IMG.hero,
    palette: ['#FDFCF9', '#171512', '#5A6B4D'],
  },
  {
    to: '/look/2',
    num: '02',
    name: 'Dark Luxury',
    nameAr: 'فخامة داكنة',
    desc: 'Espresso black, brass-gold hairlines, serif display type — the showroom at night.',
    descAr: 'أسود إسبريسو وخطوط ذهبية رفيعة وخط فاخر — صالة العرض ليلاً.',
    img: IMG.loungeDark,
    palette: ['#131009', '#EFE9DD', '#C9A86A'],
  },
  {
    to: '/look/3',
    num: '03',
    name: 'Quiet Gallery',
    nameAr: 'معرض هادئ',
    desc: 'Warm greige canvas, serif-led type, museum-caption details — the calmest and most understated of the three.',
    descAr: 'خلفية بيج هادئة وخط كلاسيكي وتفاصيل متحفية — الأكثر هدوءاً واتزاناً بين الثلاثة.',
    img: IMG.roomHotspots,
    palette: ['#F1EDE5', '#2A241C', '#8A6D4F'],
  },
];

export default function LooksIndex() {
  const [lang, setLang] = useState<Lang>(() =>
    typeof localStorage !== 'undefined' && localStorage.getItem('diyar-look-lang') === 'en' ? 'en' : 'ar',
  );
  const ar = lang === 'ar';
  const t = (en: string, arText: string) => (ar ? arText : en);
  const toggle = () => {
    const next: Lang = ar ? 'en' : 'ar';
    setLang(next);
    localStorage.setItem('diyar-look-lang', next);
  };

  const arFont = "font-['Alexandria',sans-serif]";
  const body = ar ? `${arFont}` : "font-['Outfit',sans-serif]";

  return (
    <div dir={ar ? 'rtl' : 'ltr'} className={`min-h-screen bg-[#111009] text-[#EFE9DD] ${body} flex flex-col`}>
      <header className="max-w-[1200px] w-full mx-auto px-6 pt-10 pb-4 flex items-center justify-between">
        <img src="/logo_diyar.svg" alt="DIYAR" className="h-9 invert" />
        <div className="flex items-center gap-6">
          <span className={`text-[11px] uppercase text-white/40 ${ar ? '' : 'tracking-[0.3em]'}`}>
            {t('Redesign Proposal — 2026', 'مقترح إعادة التصميم — 2026')}
          </span>
          <button
            type="button"
            data-testid="lang-toggle"
            onClick={toggle}
            className="flex items-center gap-2 text-[12px] text-white/60 hover:text-white transition-colors"
          >
            <span className={ar ? 'text-white/50' : 'font-bold text-white'}>ENG</span>
            <span className="h-3 w-px bg-white/30" />
            <span className={`font-['Alexandria',sans-serif] ${ar ? 'font-bold text-white' : 'text-white/50'}`}>عربي</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className={`text-[11px] uppercase text-white/40 mb-3 ${ar ? '' : 'tracking-[0.3em]'}`}>
            {t('Diyar — Redesign', 'ديار — إعادة التصميم')}
          </p>
          <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-3 ${ar ? '' : 'uppercase'}`}>
            {t('Three Design Directions', 'ثلاثة اتجاهات تصميمية')}
          </h1>
          <p className="text-white/50 max-w-xl mb-12 leading-relaxed">
            {t(
              'One brand, one content structure — three visual voices. Open each look, scroll it end to end, and tell us which world Diyar should live in.',
              'علامة واحدة وبنية محتوى واحدة — بثلاث هويات بصرية. افتح كل اتجاه وتصفحه حتى النهاية، وأخبرنا أي عالم يليق بديار.',
            )}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {LOOKS.map((look, i) => (
            <motion.div
              key={look.to}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
            >
              <Link to={look.to} className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/30 transition-colors">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={look.img} alt={ar ? look.nameAr : look.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className={`absolute top-4 start-4 text-[11px] text-white/80 ${ar ? '' : 'tracking-[0.3em]'}`}>
                    {t(`LOOK ${look.num}`, `التصميم ${look.num}`)}
                  </span>
                  <div className="absolute bottom-4 start-4 flex gap-1.5">
                    {look.palette.map((c) => (
                      <span key={c} className="w-4 h-4 rounded-full border border-white/40" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-1">{ar ? look.nameAr : look.name}</h2>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{ar ? look.descAr : look.desc}</p>
                  <span className={`inline-flex items-center gap-2 text-[12px] uppercase text-white/80 group-hover:text-white transition-colors ${ar ? '' : 'tracking-[0.2em]'}`}>
                    {t('View Look', 'استعرض التصميم')}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className={`max-w-[1200px] w-full mx-auto px-6 py-8 text-[11px] uppercase text-white/30 ${ar ? '' : 'tracking-[0.2em]'}`}>
        {t('© 2026 Diyar — Internal design review', '© 2026 ديار — مراجعة تصميم داخلية')}
      </footer>
    </div>
  );
}
