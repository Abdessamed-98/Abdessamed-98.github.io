import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCheck, MapPin, Palette, Search, Send } from 'lucide-react';
import { DesignPreview } from './DesignerStudio';
import { REQUESTS, loadSent, sar, type DesignRequest, type SentDesign } from './designerData';

type Msg = { from: 'client' | 'me'; text?: string; img?: string; design?: SentDesign; at: string };

/** What the client wrote when they opened the chat from «استشر مصمم»: their words, then the photo of their room. */
function conversation(r: DesignRequest, sent?: SentDesign): Msg[] {
  const list: Msg[] = [
    { from: 'client', text: r.note, at: r.date },
    { from: 'client', img: r.photo, at: r.date },
    { from: 'client', text: `الميزانية ${r.budget}، وأفضّل النمط: ${r.style}.`, at: r.date },
  ];
  if (r.status === 'working') list.push({ from: 'me', text: `أهلاً ${r.client.split(' ')[0]}، وصلتني الصورة. أعمل على التصميم وأرسله لك اليوم.`, at: r.date });
  if (sent) list.push({ from: 'me', text: sent.note, design: sent, at: sent.sentAt });
  return list;
}

export default function DesignerChat() {
  const { id } = useParams();
  const sent = loadSent();
  const active = REQUESTS.find((r) => r.id === id);
  // on a wide screen a conversation is always open; on a phone the list comes first
  const shown = active ?? REQUESTS[0];
  const sentOf = (r: DesignRequest) => sent.find((s) => s.requestId === r.id);

  const [extra, setExtra] = useState<Record<string, Msg[]>>({});
  const [draft, setDraft] = useState('');
  const [q, setQ] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const messages = [...conversation(shown, sentOf(shown)), ...(extra[shown.id] ?? [])];

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [shown.id, messages.length]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setExtra((x) => ({ ...x, [shown.id]: [...(x[shown.id] ?? []), { from: 'me', text, at: new Date().toTimeString().slice(0, 5) }] }));
    setDraft('');
  };

  const people = REQUESTS.filter((r) => !q.trim() || r.client.includes(q.trim()) || r.room.includes(q.trim()));

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" dir="rtl" data-testid="designer-chat">
      {/* ---------------- conversations ---------------- */}
      <div className={`${active ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-l border-gray-100 md:w-80`}>
        <div className="border-b border-gray-100 p-4">
          <h2 className="mb-3 text-lg font-bold text-diyar-dark">محادثات العملاء</h2>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} type="text" placeholder="ابحث باسم العميل..." className="w-full rounded-lg border border-gray-100 bg-gray-50 py-2 pl-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-diyar-brown" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {people.map((r) => {
            const done = !!sentOf(r);
            return (
              <Link
                key={r.id}
                to={`/dashboard/designer/chat/${r.id}`}
                data-testid="designer-thread"
                className={`flex items-center gap-3 border-b border-gray-50 p-4 transition-colors hover:bg-gray-50 ${shown.id === r.id ? 'md:bg-purple-50/50' : ''}`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-diyar-cream font-bold text-diyar-dark">{r.client[0]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="truncate font-bold text-diyar-dark">{r.client}</h4>
                    <span className="shrink-0 text-[11px] text-gray-400">{r.date}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{done ? 'أرسلتَ التصميم' : r.status === 'working' ? 'تعمل على التصميم' : `أرسل صورة ${r.room}`}</p>
                </div>
                {done ? <CheckCheck size={16} className="shrink-0 text-green-600" /> : r.status === 'new' && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-purple-600"></span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ---------------- the open conversation ---------------- */}
      <div className={`${active ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
        <div className="flex items-center gap-3 border-b border-gray-100 p-4">
          <Link to="/dashboard/designer/chat" className="-mr-1 rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden">
            <ArrowRight size={18} />
          </Link>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-diyar-cream font-bold text-diyar-dark">{shown.client[0]}</div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-bold text-diyar-dark">{shown.client}</h3>
            <p className="flex items-center gap-1 truncate text-xs text-gray-400">
              <MapPin size={12} /> {shown.city}
            </p>
          </div>
          <Link to={`/dashboard/designer/studio/${shown.id}`} className="flex shrink-0 items-center gap-2 rounded-xl bg-diyar-brown px-4 py-2 text-sm font-bold text-white transition hover:bg-[#8A6D46]">
            <Palette size={16} /> <span className="hidden sm:inline">{sentOf(shown) ? 'تعديل التصميم' : 'صمّم الغرفة'}</span>
          </Link>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.design ? 'w-full max-w-md' : 'max-w-[80%] md:max-w-[60%]'} rounded-2xl text-sm leading-relaxed shadow-sm ${m.img || m.design ? 'p-2' : 'px-4 py-3'} ${m.from === 'me' ? 'bg-diyar-dark text-white' : 'border border-gray-100 bg-white text-gray-700'}`}>
                {m.img && (
                  <div data-testid="designer-chat-photo">
                    <img src={m.img} alt="" className="block max-h-72 w-auto max-w-full rounded-xl" />
                    <Link to={`/dashboard/designer/studio/${shown.id}`} data-testid="chat-open-studio" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-2 text-sm font-bold text-white transition hover:bg-purple-700">
                      <Palette size={16} /> صمّم على هذه الصورة
                    </Link>
                  </div>
                )}
                {m.design && (
                  <div data-testid="designer-chat-design" className="mb-2">
                    <DesignPreview image={m.design.image} rendered={m.design.rendered} pins={m.design.pins} />
                    <p className="px-2 pt-2 text-xs text-white/70">
                      {m.design.pins.length} منتجات بروابطها · {sar(m.design.total)} ر.س
                    </p>
                  </div>
                )}
                {m.text && <p className={m.design ? 'px-2' : ''}>{m.text}</p>}
                <span className={`mt-1 block text-[11px] ${m.img || m.design ? 'px-2' : ''} ${m.from === 'me' ? 'text-white/50' : 'text-gray-400'}`}>{m.at}</span>
              </div>
            </div>
          ))}
          <div ref={end} />
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-gray-100 p-3">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} data-testid="designer-chat-input" type="text" placeholder="اكتب رسالة للعميل..." className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-diyar-brown" />
          <button type="submit" data-testid="designer-chat-send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-diyar-brown text-white transition hover:bg-[#8A6D46]">
            <Send size={17} className="-scale-x-100" />
          </button>
        </form>
      </div>
    </div>
  );
}
