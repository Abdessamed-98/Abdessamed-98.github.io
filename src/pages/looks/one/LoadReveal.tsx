/**
 * Look 1 — the page arrives through the logo.
 *
 * On the first load of the session a plate the colour of the page covers
 * everything with the Diyar mark cut out of it, so the site is visible only
 * inside the letters. It holds for a beat, then the mark opens out until its
 * counters are wider than the screen and the plate has nothing left to cover
 * with; it fades on the last of the travel and the page is simply there. The
 * same move the client liked on the room stage, in the brand's own shape.
 *
 * Whatever is behind the cut-out at that moment is what the mark is drawn in
 * — the hero, so ink on cream. In case the hero is still arriving, a solid
 * ink mark sits over the plate for the hold and hands over to the cut-out as
 * it starts to open, so there is never a frame with nothing in the middle. It
 * is there from the first frame, not faded in: a fade-in read as the logo
 * being late.
 *
 * Once per page load: it is an arrival, not a page transition, so moving about
 * the site does not replay it, but a refresh is a new arrival and plays it
 * again. That is a module-level flag, not sessionStorage — session storage
 * survives a refresh, so the first version played exactly once per tab and
 * never again, which is not what "on first load" means. Reduced motion skips
 * it entirely — a two-second curtain is exactly the kind of thing that
 * preference exists to decline.
 *
 * The logo is inlined from public/logo_diyar.svg (viewBox 303×125) so the mask
 * needs no fetch and cannot miss its first frame.
 */
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BG, INK } from './ui';

/** lives as long as the document does: reset by a refresh, kept across routes */
let arrived = false;
/** the whole thing, hold and opening, in ms — one second, no more */
const TOTAL_MS = 1000;
/** the mask's own square, in user units, and a rect big enough to cover it once `slice` has scaled it */
const VB = 1000;
const OVER = { x: -2000, y: -2000, width: 5000, height: 5000 };
/** the mark as drawn in its file, and how wide it starts, in user units */
const LOGO_W = 303.03;
const LOGO_H = 125.26;
const K = 250 / LOGO_W;
const PLACE = `translate(${VB / 2 - (LOGO_W * K) / 2} ${VB / 2 - (LOGO_H * K) / 2}) scale(${K})`;

function Mark() {
  return (
    <g transform={PLACE}>
          <path d="M26.5,77.04c-3.81-2.25-8.51-3.38-14.1-3.38H.98v51.43h10.04c5.85,0,10.79-1.2,14.79-3.6,4.01-2.4,6.99-5.62,8.95-9.66,1.96-4.04,2.94-8.51,2.94-13.41,0-4.55-.91-8.69-2.74-12.42-1.83-3.72-4.65-6.71-8.45-8.96M27.85,112.08c-1.19,3.23-3.09,5.85-5.71,7.86-2.62,2.01-5.98,3.01-10.07,3.01-1.24,0-2.39-.04-3.43-.13v-47.28c.61-.04,1.23-.06,1.85-.06,3.74,0,7.07,1.08,9.97,3.23,2.91,2.16,5.16,5.19,6.77,9.11,1.61,3.92,2.41,8.42,2.41,13.52,0,3.92-.59,7.5-1.78,10.73"/>
          <rect x="44.36" y="73.66" width="7.59" height="51.43"/>
          <path d="M94.74,77.11c.57-.88.69-1.69.36-2.42-.33-.73-.96-1.1-1.88-1.1l-6.21.07-8.42,29.57-13.51-29.57h-8.12l15.12,32.99v18.44h7.66l-.07-19.69c1.54-4.26,3.69-8.91,6.44-13.96,2.75-5.04,5.62-9.82,8.62-14.33"/>
          <path d="M103.59,73.66l5.37,12.43-19.5,39.01h7.59c.88,0,1.63-.28,2.25-.85.62-.56,1.01-1.33,1.19-2.32.42-2.5.91-5.05,1.47-7.64h18.36l4.27,10.8h8.06l-20.47-51.43h-8.58ZM102.43,112.16c.68-2.99,1.45-6.03,2.32-9.15,1.48-5.35,3.12-10.57,4.91-15.64l9.81,24.79h-17.04Z"/>
          <path d="M172.27,125.09l-12.9-18.84s.01,0,.02-.01c2.99-1.44,5.38-3.53,7.16-6.25,1.78-2.72,2.68-5.92,2.68-9.59,0-3.18-.73-6.04-2.18-8.56-1.45-2.52-3.71-4.52-6.77-5.99-3.06-1.47-6.86-2.2-11.39-2.2h-11.09v51.43h7.59v-16.68h4.29c.76,0,1.5-.04,2.24-.1l11.23,16.78h9.11ZM147.84,106.35c-.85,0-1.67-.04-2.44-.13v-30.79c.59-.03,1.21-.06,1.85-.09,2.42.05,4.69.71,6.8,1.98,2.11,1.27,3.82,3.2,5.12,5.77,1.3,2.57,1.95,5.67,1.95,9.29,0,4.26-1.04,7.65-3.1,10.18-2.07,2.52-5.46,3.78-10.17,3.78"/>
          <path d="M43.23,47.1C28.25,31.16,36.59,3.34,37.59.17c2.05,2.19,4.09,4.37,6.14,6.56-.92,3.72-2.67,11.91-2,20.67.65,8.51,3.18,12.21,4.6,13.92,9.96,11.94,92.91,3.99,96.09-4.28.1-.25.15-.49.15-.49.45-2.32-1.56-6.07-12.86-12.31,1.5-3.27,2.99-6.54,4.49-9.8,1.5,1.9,3.42,4.64,5.16,8.19,1.86,3.79,6.27,12.86,4.39,18.95-3.8,12.32-34.47,13.53-49.59,14.07-27.67.99-41.5,1.48-50.92-8.54"/>
          <path d="M18.98,57.97c-6.33-2.4-12.65-4.8-18.98-7.2,18.81-6.22,28.03-11.64,27.64-16.25-.24-2.9-4.28-5.48-12.11-7.74,1.63-4.1,3.26-8.19,4.89-12.29,1.86,1.25,11.13,8.07,11.43,19.79.18,7.19-3.74,12.97-5.52,15.65-2.53,3.82-5.34,6.43-7.35,8.04"/>
          <path d="M168.86,23.15c-1.17-1.53-2.4-2.88-3.62-4.07l5.29,1.06-12.73-6.7c-3.07,2.01-6.14,4.02-9.21,6.03,8.98,3.48,18.85,8.02,18.26,11.39-.15.88-.98,1.42-1.68,1.84-6.2,3.79-13.75,6.16-18.43,7.43,2.4,2.77,4.8,5.55,7.2,8.32,2.19-.9,5.44-2.41,9.05-4.86,5.28-3.58,9.83-6.68,10.22-11.22.27-3.16-1.6-5.61-4.35-9.21"/>
          <rect x="82.46" y="60.98" width="7.39" height="7.39" transform="translate(-20.5 79.86) rotate(-45)"/>
          <rect x="92.78" y="60.98" width="7.39" height="7.39" transform="translate(-17.47 87.16) rotate(-45)"/>
          <polygon points="61.33 33.43 116.44 25.89 116.11 24.71 61.33 33.43"/>
          <polyline points="61.33 33.43 61.33 33.41 115.94 24.21 116.44 25.89"/>
          <path d="M182.78,0h34.41c.18,0,.32.14.32.32l-.04,13.91c0,.09-.04.18-.1.24l-34.36,32.1c-.21.2-.55.05-.55-.23V.32c0-.18.14-.32.32-.32"/>
          <path d="M249.37,92.88v-45.71c0-.09-.04-.18-.1-.24l-31.45-32.03c-.21-.21-.06-.59.25-.59h56.25c.11,0,.2.05.27.12l28.35,32.42c.06.06.09.14.09.23v77.82c0,.2-.15.35-.35.35h-119.87c-.2,0-.35-.15-.35-.35v-31.33c0-.2.15-.35.35-.35h66.22c.2,0,.35-.15.35-.35"/>
    </g>
  );
}

export function LoadReveal() {
  /* Decided in the initialiser, written in the effect: StrictMode runs
     initialisers twice in development, and a write on the first run would
     make the second one think the arrival had already happened. */
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !arrived;
  });

  useEffect(() => {
    if (!show) return;
    arrived = true;
    const id = window.setTimeout(() => setShow(false), TOTAL_MS);
    return () => window.clearTimeout(id);
  }, [show]);

  if (!show) return null;

  const t = (ms: number) => ms / TOTAL_MS;

  return (
    <div aria-hidden data-testid="load-reveal" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {/* the plate with the mark cut out of it */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VB} ${VB}`}
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: TOTAL_MS / 1000, times: [0, t(620), 1], ease: 'easeInOut' }}
      >
        <defs>
          <mask id="diyar-arrival" maskUnits="userSpaceOnUse" {...OVER}>
            <rect {...OVER} fill="#fff" />
            <motion.g
              style={{ transformBox: 'view-box', transformOrigin: '50% 50%' }}
              initial={{ scale: 0.96 }}
              animate={{ scale: [0.96, 1, 1, 30] }}
              transition={{
                duration: TOTAL_MS / 1000,
                times: [0, t(250), t(380), 1],
                ease: ['easeOut', 'linear', [0.7, 0, 0.25, 1]],
              }}
            >
              <g fill="#000">
                <Mark />
              </g>
            </motion.g>
          </mask>
        </defs>
        <rect {...OVER} fill={BG} mask="url(#diyar-arrival)" />
      </motion.svg>

      {/* the mark in ink, for the hold — fades as the cut-out takes over */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VB} ${VB}`}
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: TOTAL_MS / 1000, times: [0, t(300), t(480)], ease: 'easeInOut' }}
      >
        <motion.g
          style={{ transformBox: 'view-box', transformOrigin: '50% 50%' }}
          initial={{ scale: 0.96 }}
          animate={{ scale: [0.96, 1, 1, 30] }}
          transition={{
            duration: TOTAL_MS / 1000,
            times: [0, t(250), t(380), 1],
            ease: ['easeOut', 'linear', [0.7, 0, 0.25, 1]],
          }}
        >
          <g fill={INK}>
            <Mark />
          </g>
        </motion.g>
      </motion.svg>
    </div>
  );
}
