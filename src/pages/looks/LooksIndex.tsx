/**
 * Chooser page for the 3 redesign directions — this is the link sent to the client.
 */
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { IMG } from './lookShared.tsx';

const LOOKS = [
  {
    to: '/look/1',
    num: '01',
    name: 'Editorial Light',
    ar: 'إيديتوريال فاتح',
    desc: 'Gallery-white canvas, bold uppercase titles, olive accents — the closest match to the reference direction.',
    img: IMG.hero,
    palette: ['#FDFCF9', '#171512', '#5A6B4D'],
  },
  {
    to: '/look/2',
    num: '02',
    name: 'Dark Luxury',
    ar: 'فخامة داكنة',
    desc: 'Espresso black, brass-gold hairlines, serif display type — the showroom at night.',
    img: IMG.loungeDark,
    palette: ['#131009', '#EFE9DD', '#C9A86A'],
  },
  {
    to: '/look/3',
    num: '03',
    name: 'Quiet Gallery',
    ar: 'معرض هادئ',
    desc: 'Warm greige canvas, serif-led type, museum-caption details — the calmest and most understated of the three.',
    img: IMG.roomHotspots,
    palette: ['#F1EDE5', '#2A241C', '#8A6D4F'],
  },
];

export default function LooksIndex() {
  return (
    <div dir="ltr" className="min-h-screen bg-[#111009] text-[#EFE9DD] font-['Outfit',sans-serif] flex flex-col">
      <header className="max-w-[1200px] w-full mx-auto px-6 pt-10 pb-4 flex items-center justify-between">
        <img src="/logo_diyar.svg" alt="DIYAR" className="h-9 invert" />
        <span className="text-[11px] tracking-[0.3em] uppercase text-white/40">Redesign Proposal — 2026</span>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-['Amiri',serif] text-2xl text-white/60 mb-2">ثلاثة اتجاهات تصميمية</p>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight mb-3">Three Design Directions</h1>
          <p className="text-white/50 max-w-xl mb-12">
            One brand, one content structure — three visual voices. Open each look, scroll it end to end, and tell us which world Diyar should live in.
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
                  <img src={look.img} alt={look.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute top-4 left-4 text-[11px] tracking-[0.3em] text-white/80">LOOK {look.num}</span>
                  <div className="absolute bottom-4 left-4 flex gap-1.5">
                    {look.palette.map((c) => (
                      <span key={c} className="w-4 h-4 rounded-full border border-white/40" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-bold">{look.name}</h2>
                    <span className="font-['Amiri',serif] text-white/50">{look.ar}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-4">{look.desc}</p>
                  <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.2em] uppercase text-white/80 group-hover:text-white transition-colors">
                    View Look <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="max-w-[1200px] w-full mx-auto px-6 py-8 text-[11px] tracking-[0.2em] uppercase text-white/30">
        © 2026 Diyar — Internal design review
      </footer>
    </div>
  );
}
