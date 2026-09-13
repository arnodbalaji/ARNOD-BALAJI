import { useEffect, useRef, useState } from "react";
import { Lock, LogOut, Save, Loader2, QrCode, Upload, KeyRound } from "lucide-react";
import { Toaster, toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const FIELDS = [
  { key: "accountName", label: "Account Name", hi: "खाता नाम" },
  { key: "bankName", label: "Bank Name", hi: "बैंक का नाम" },
  { key: "accountNumber", label: "Account Number", hi: "खाता संख्या" },
  { key: "ifsc", label: "IFSC", hi: "IFSC कोड" },
  { key: "upiId", label: "UPI ID", hi: "UPI आईडी" },
];

const absUrl = (u) => (u && u.startsWith("/api") ? `${BACKEND}${u}` : u);

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("owner_token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const fileRef = useRef(null);
  const [form, setForm] = useState({ qrImage: "", accountName: "", bankName: "", accountNumber: "", ifsc: "", upiId: "" });

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/seva`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setForm((f) => ({ ...f, ...Object.fromEntries(Object.entries(d).filter(([, v]) => typeof v === "string")) })))
      .catch(() => {});
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const detail = data.detail;
        setError(typeof detail === "string" ? detail : "लॉगिन विफल");
        return;
      }
      localStorage.setItem("owner_token", data.token);
      setToken(data.token);
      toast.success("स्वागत है 🙏");
    } catch {
      setError("सर्वर से संपर्क नहीं हो पाया");
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/seva`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.status === 401) {
        localStorage.removeItem("owner_token");
        setToken("");
        toast.error("सत्र समाप्त — पुनः लॉगिन करें");
        return;
      }
      if (!res.ok) throw new Error();
      toast.success("सेवा विवरण सहेज लिया गया ✅");
    } catch {
      toast.error("सहेजने में त्रुटि");
    } finally {
      setBusy(false);
    }
  };

  const uploadQr = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API}/admin/qr-upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "अपलोड विफल");
      setForm((f) => ({ ...f, qrImage: data.url }));
      toast.success("QR कोड अपलोड हो गया ✅");
    } catch (e) {
      toast.error(e.message || "अपलोड विफल");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const changePassword = async () => {
    if (pwForm.next !== pwForm.confirm) {
      toast.error("नया पासवर्ड और पुष्टि मेल नहीं खाते");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.detail === "string" ? data.detail : "त्रुटि");
      toast.success("पासवर्ड बदल गया ✅");
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("owner_token");
    setToken("");
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#fdfbf7] flex items-center justify-center px-5 py-16">
      <Toaster position="top-center" theme="dark" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex w-14 h-14 rounded-full gold-frame items-center justify-center text-[#ff8c00] font-dev text-2xl">ॐ</span>
          <h1 className="mt-4 font-dev text-2xl text-gold-gradient">मंदिर Owner पैनल</h1>
          <p className="text-xs text-[#fdfbf7]/45 mt-1">Shri Sankat Haran Balaji Maharaj Mandir, Arnod</p>
        </div>

        {!token ? (
          <form
            data-testid="owner-login-form"
            onSubmit={login}
            className="glass-gold rounded-3xl p-8 space-y-4"
          >
            <div className="flex items-center gap-2 text-[#d4af37] text-sm mb-2">
              <Lock size={15} />
              <span className="font-display text-[11px] tracking-[0.3em] uppercase">Owner Login</span>
            </div>
            <input
              data-testid="owner-email-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ईमेल"
              className="w-full rounded-xl bg-[#0b0e14] border border-[#d4af37]/25 px-4 py-3 text-sm outline-none focus:border-[#ff8c00]/60"
            />
            <input
              data-testid="owner-password-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="पासवर्ड"
              className="w-full rounded-xl bg-[#0b0e14] border border-[#d4af37]/25 px-4 py-3 text-sm outline-none focus:border-[#ff8c00]/60"
            />
            {error && (
              <p data-testid="owner-login-error" className="text-sm text-red-400">{error}</p>
            )}
            <button
              data-testid="owner-login-button"
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] py-3.5 font-semibold text-[#1a0303] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              लॉगिन करें
            </button>
            <a href="/" className="block text-center text-xs text-[#fdfbf7]/40 hover:text-[#f3e5ab] mt-2">
              ← मुख्य वेबसाइट पर वापस जाएँ
            </a>
          </form>
        ) : (
          <div className="space-y-6">
            <div data-testid="owner-dashboard" className="glass-gold rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-[#d4af37]">
                  <QrCode size={16} />
                  <span className="font-display text-[11px] tracking-[0.3em] uppercase">Seva / UPI Settings</span>
                </div>
                <button
                  data-testid="owner-logout-button"
                  onClick={logout}
                  className="flex items-center gap-1.5 text-xs text-[#fdfbf7]/50 hover:text-red-400 transition-colors"
                >
                  <LogOut size={13} /> Logout
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[#f3e5ab]/70">QR Code Image (UPI)</label>
                  <input
                    ref={fileRef}
                    data-testid="seva-qr-file-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => uploadQr(e.target.files?.[0])}
                    className="hidden"
                  />
                  <button
                    data-testid="seva-qr-upload-button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="mt-1.5 w-full rounded-xl border-2 border-dashed border-[#d4af37]/40 py-6 text-sm text-[#f3e5ab]/80 hover:border-[#ff8c00]/60 hover:bg-[#d4af37]/5 transition-colors flex flex-col items-center gap-2"
                  >
                    {uploading ? <Loader2 size={20} className="animate-spin text-[#ff8c00]" /> : <Upload size={20} className="text-[#d4af37]" />}
                    {uploading ? "अपलोड हो रहा है…" : "QR फोटो अपलोड करें (jpg/png)"}
                  </button>
                  {form.qrImage && (
                    <img
                      data-testid="seva-qr-preview"
                      src={absUrl(form.qrImage)}
                      alt="QR preview"
                      className="mt-3 w-32 h-32 object-contain rounded-xl border border-[#d4af37]/30 bg-white p-1"
                    />
                  )}
                  <input
                    data-testid="seva-qr-input"
                    value={form.qrImage}
                    onChange={(e) => setForm({ ...form, qrImage: e.target.value })}
                    placeholder="या QR image का URL यहाँ डालें…"
                    className="mt-2 w-full rounded-xl bg-[#0b0e14] border border-[#d4af37]/25 px-4 py-2.5 text-xs outline-none focus:border-[#ff8c00]/60 text-[#fdfbf7]/70"
                  />
                </div>
                {FIELDS.map((f) => (
                  <div key={f.key}>
                    <label className="text-xs text-[#f3e5ab]/70">
                      {f.label} <span className="text-[#fdfbf7]/35">({f.hi})</span>
                    </label>
                    <input
                      data-testid={`seva-field-${f.key}`}
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="mt-1.5 w-full rounded-xl bg-[#0b0e14] border border-[#d4af37]/25 px-4 py-3 text-sm outline-none focus:border-[#ff8c00]/60"
                    />
                  </div>
                ))}
              </div>

              <button
                data-testid="seva-save-button"
                onClick={save}
                disabled={busy}
                className="mt-7 w-full rounded-full bg-gradient-to-r from-[#ff6b00] to-[#ff8c00] py-3.5 font-semibold text-[#1a0303] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                सहेजें (Save)
              </button>
              <p className="mt-4 text-[11px] text-[#fdfbf7]/40 text-center leading-relaxed">
                सहेजते ही ये विवरण वेबसाइट के Seva भाग में तुरंत दिखने लगेंगे। केवल आधिकारिक मंदिर विवरण ही भरें।
              </p>
            </div>

            <div className="glass-gold rounded-3xl p-8">
              <div className="flex items-center gap-2 text-[#d4af37] mb-5">
                <KeyRound size={16} />
                <span className="font-display text-[11px] tracking-[0.3em] uppercase">पासवर्ड बदलें</span>
              </div>
              <div className="space-y-3">
                <input
                  data-testid="pw-current-input"
                  type="password"
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  placeholder="वर्तमान पासवर्ड"
                  className="w-full rounded-xl bg-[#0b0e14] border border-[#d4af37]/25 px-4 py-3 text-sm outline-none focus:border-[#ff8c00]/60"
                />
                <input
                  data-testid="pw-new-input"
                  type="password"
                  value={pwForm.next}
                  onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                  placeholder="नया पासवर्ड (कम से कम 8 अक्षर)"
                  className="w-full rounded-xl bg-[#0b0e14] border border-[#d4af37]/25 px-4 py-3 text-sm outline-none focus:border-[#ff8c00]/60"
                />
                <input
                  data-testid="pw-confirm-input"
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  placeholder="नए पासवर्ड की पुष्टि"
                  className="w-full rounded-xl bg-[#0b0e14] border border-[#d4af37]/25 px-4 py-3 text-sm outline-none focus:border-[#ff8c00]/60"
                />
                <button
                  data-testid="pw-change-button"
                  onClick={changePassword}
                  disabled={busy || !pwForm.current || !pwForm.next}
                  className="w-full rounded-full border border-[#d4af37]/50 py-3 font-medium text-[#f3e5ab] hover:bg-[#d4af37]/10 disabled:opacity-40 transition-colors"
                >
                  पासवर्ड बदलें
                </button>
              </div>
            </div>

            <a href="/" className="block text-center text-xs text-[#fdfbf7]/40 hover:text-[#f3e5ab]">
              ← मुख्य वेबसाइट देखें
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
