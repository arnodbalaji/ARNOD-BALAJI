import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Mic } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SUGGESTIONS = [
  "हनुमान चालीसा का महत्व क्या है?",
  "श्रीमद्भगवद्गीता का सार बताइए",
  "बालाजी महाराज की उपासना विधि?",
  "वेदों में जीवन का उद्देश्य क्या है?",
];

const getSessionId = () => {
  let id = localStorage.getItem("sanatan_session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("sanatan_session", id);
  }
  return id;
};

export default function SanatanChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const sessionId = useRef(getSessionId());
  const listRef = useRef(null);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setInput("🎤 आपका ब्राउज़र voice input support नहीं करता — कृपया लिखें");
      return;
    }
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.interimResults = false;
    rec.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  };

  useEffect(() => {
    if (!open) return;
    fetch(`${API}/chat/history/${sessionId.current}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setMessages(d.messages || []))
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: message }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch(`${API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId.current, message }),
      });
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop();
        for (const part of parts) {
          const line = part.replace(/^data: /, "").trim();
          if (!line || line === "[DONE]") continue;
          try {
            const obj = JSON.parse(line);
            if (obj.token) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = {
                  role: "assistant",
                  content: copy[copy.length - 1].content + obj.token,
                };
                return copy;
              });
            } else if (obj.error) {
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: obj.error };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "क्षमा करें, संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें। 🙏",
        };
        return copy;
      });
    }
    setBusy(false);
  };

  return (
    <>
      <motion.button
        data-testid="chat-open-button"
        onClick={() => setOpen((v) => !v)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-[60] w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] text-[#1a0303] font-dev text-2xl flex items-center justify-center shadow-[0_0_32px_rgba(255,107,0,0.5)] hover:shadow-[0_0_48px_rgba(255,107,0,0.7)] hover:scale-105 transition-[box-shadow,transform] duration-300"
        aria-label="Sanatan Gyan Chatbot"
      >
        {open ? <X size={24} /> : "ॐ"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] max-w-md h-[70vh] max-h-[600px] rounded-3xl overflow-hidden flex flex-col bg-[#131822]/95 backdrop-blur-2xl border border-[#d4af37]/30 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="px-5 py-4 bg-gradient-to-r from-[#3b0909] to-[#1a0303] border-b border-[#d4af37]/25 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-[#ff6b00]/15 border border-[#ff8c00]/40 flex items-center justify-center text-[#ff8c00] font-dev text-lg">
                ॐ
              </span>
              <div>
                <h3 className="font-dev text-lg text-gold-gradient leading-tight">सनातन ज्ञान मित्र</h3>
                <p className="text-[10px] font-display tracking-[0.2em] uppercase text-[#fdfbf7]/45">
                  वेद • उपनिषद • पुराण • गीता
                </p>
              </div>
            </div>

            <div ref={listRef} data-testid="chat-message-list" className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center pt-6">
                  <p className="font-dev-body text-[#f3e5ab]/80 text-sm leading-relaxed">
                    🙏 नमस्ते भक्त जन! वेद, पुराण, गीता, रामायण, हनुमान उपासना — सनातन धर्म से जुड़ा
                    कोई भी प्रश्न पूछिए।
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        data-testid={`chat-suggestion-${SUGGESTIONS.indexOf(s)}`}
                        onClick={() => send(s)}
                        className="rounded-full border border-[#d4af37]/35 bg-[#d4af37]/5 px-3.5 py-2 text-xs text-[#f3e5ab]/85 hover:bg-[#d4af37]/15 hover:border-[#d4af37] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] text-[#1a0303] px-4 py-2.5 text-sm font-medium">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-start">
                    <div className="max-w-[88%] rounded-2xl rounded-bl-md glass-gold px-4 py-2.5 text-sm text-[#fdfbf7]/90 leading-relaxed whitespace-pre-wrap">
                      {m.content
                        ? m.content.replace(/\*\*/g, "")
                        : busy && i === messages.length - 1
                          ? "…"
                          : ""}
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="p-3 border-t border-[#d4af37]/20 bg-[#0b0e14]/70 flex items-center gap-2">
              <input
                data-testid="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="अपना प्रश्न लिखें…"
                className="flex-1 rounded-full bg-[#131822] border border-[#d4af37]/25 px-4 py-3 text-sm text-[#fdfbf7] placeholder:text-[#fdfbf7]/35 outline-none focus:border-[#ff8c00]/60"
              />
              <button
                data-testid="chat-mic-button"
                onClick={startListening}
                className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors ${
                  listening
                    ? "border-red-500 bg-red-500/20 text-red-400 animate-pulse"
                    : "border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37]/10"
                }`}
                aria-label="Voice input"
              >
                <Mic size={17} />
              </button>
              <button
                data-testid="chat-send-button"
                onClick={() => send()}
                disabled={busy || !input.trim()}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ff6b00] to-[#ff8c00] text-[#1a0303] flex items-center justify-center disabled:opacity-40 hover:shadow-[0_0_20px_rgba(255,107,0,0.5)] transition-shadow"
                aria-label="Send"
              >
                {busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
