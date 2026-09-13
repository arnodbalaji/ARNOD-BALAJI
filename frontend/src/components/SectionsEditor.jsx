import { useEffect, useRef, useState } from "react";
import { Plus, Upload, Loader2, Save, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const inputCls =
  "w-full rounded-xl bg-[#0b0e14] border border-[#d4af37]/25 px-4 py-3 text-sm outline-none focus:border-[#ff8c00]/60";

export default function SectionsEditor({ token, onUnauthorized }) {
  const [sections, setSections] = useState([]);
  const [busy, setBusy] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileRef = useRef(null);
  const uploadIdx = useRef(null);

  useEffect(() => {
    fetch(`${API}/settings`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => setSections(d.customSections || []))
      .catch(() => {});
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ customSections: sections.filter((s) => s.title.trim()) }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (!res.ok) throw new Error();
      toast.success("Sections सहेज लिए गए ✅ — वेबसाइट पर दिखने लगेंगे");
    } catch {
      toast.error("सहेजने में त्रुटि");
    } finally {
      setBusy(false);
    }
  };

  const uploadFile = async (file) => {
    const i = uploadIdx.current;
    if (!file || i == null) return;
    setUploadingIdx(i);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "अपलोड विफल");
      setSections((s) => s.map((x, j) => (j === i ? { ...x, url: data.url } : x)));
      toast.success("फ़ाइल अपलोड हो गई ✅ — अब Save दबाएँ");
    } catch (e) {
      toast.error(e.message || "अपलोड विफल");
    } finally {
      setUploadingIdx(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const update = (i, patch) => setSections((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  return (
    <div className="glass-gold rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-[#d4af37]">
          <LayoutGrid size={16} />
          <span className="font-display text-[11px] tracking-[0.3em] uppercase">अपने Sections जोड़ें</span>
        </div>
        <div className="flex gap-2">
          {["audio", "image", "text"].map((t) => (
            <button
              key={t}
              data-testid={`section-add-${t}`}
              onClick={() => setSections((s) => [...s, { type: t, title: "", text: "", url: "" }])}
              className="flex items-center gap-1 text-xs rounded-full border border-[#d4af37]/40 px-3 py-1.5 text-[#f3e5ab] hover:bg-[#d4af37]/10 transition-colors"
            >
              <Plus size={11} /> {t === "audio" ? "भजन Audio" : t === "image" ? "Photo" : "Text"}
            </button>
          ))}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,audio/*"
        className="hidden"
        onChange={(e) => uploadFile(e.target.files?.[0])}
      />

      {sections.length === 0 && (
        <p className="text-xs text-[#fdfbf7]/40 text-center py-4">
          ऊपर से भजन audio, photo या text section जोड़ें — वेबसाइट पर "मंदिर मीडिया एवं अपडेट" में दिखेगा
        </p>
      )}

      <div className="space-y-3">
        {sections.map((sec, i) => (
          <div key={i} className="rounded-xl border border-[#d4af37]/20 p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#ff8c00]/80 w-14 shrink-0">
                {sec.type}
              </span>
              <input
                data-testid={`section-title-${i}`}
                value={sec.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Section का शीर्षक"
                className={`flex-1 ${inputCls}`}
              />
              <button
                data-testid={`section-remove-${i}`}
                onClick={() => setSections((s) => s.filter((_, j) => j !== i))}
                className="px-3 py-2 rounded-xl border border-red-500/40 text-red-400 text-xs hover:bg-red-500/10"
              >
                ✕
              </button>
            </div>
            {sec.type !== "text" && (
              <button
                data-testid={`section-upload-${i}`}
                onClick={() => {
                  uploadIdx.current = i;
                  fileRef.current?.click();
                }}
                disabled={uploadingIdx === i}
                className="w-full rounded-xl border border-dashed border-[#d4af37]/40 py-3 text-xs text-[#f3e5ab]/75 hover:bg-[#d4af37]/5 transition-colors flex items-center justify-center gap-2"
              >
                {uploadingIdx === i ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {sec.url ? "फ़ाइल बदलें" : sec.type === "audio" ? "भजन audio अपलोड करें" : "Photo अपलोड करें"}
              </button>
            )}
            {sec.url && <p className="text-[10px] text-green-400/80 truncate">✓ {sec.url}</p>}
            <input
              data-testid={`section-text-${i}`}
              value={sec.text}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder="विवरण / text (वैकल्पिक)"
              className={inputCls}
            />
          </div>
        ))}
      </div>

      {sections.length > 0 && (
        <button
          data-testid="sections-save-button"
          onClick={save}
          disabled={busy}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] py-3 font-semibold text-[#1a0303] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Sections सहेजें
        </button>
      )}
    </div>
  );
}
