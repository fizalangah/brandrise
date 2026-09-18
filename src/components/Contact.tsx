"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "923182842251";

export default function Contact() {
  const [form, setForm] = useState({ name: "", business: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Salaam! I'm ${form.name}.\nBusiness: ${form.business}\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setSent(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // backend offline ho to sirf WhatsApp hi kaafi hai
    }
  };

  const inputCls =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200";

  return (
    <section id="contact" className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-violet-400">
              Contact
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Talk to us today — <span className="text-violet-400">your first consultation is free</span>
            </h2>
            <p className="mt-4 text-slate-300">
              Message us on WhatsApp or fill in the form below. We&apos;ll reply
              within 24 hours.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-emerald-500"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold">Chat with us on WhatsApp</div>
                  <div className="text-sm text-slate-400">Direct business line</div>
                </div>
              </a>

              <a
                href="https://instagram.com/brandrise.online"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-pink-500"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
                    <circle cx="12" cy="12" r="4.2" />
                    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold">@brandrise.online</div>
                  <div className="text-sm text-slate-400">Portfolio &amp; tips</div>
                </div>
              </a>

              <a
                href="https://tiktok.com/@brandrise.online"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-4 transition hover:border-slate-400"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-600/40 text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.9 2.9 0 0 1-5.2 1.65 2.89 2.89 0 0 1 2.31-4.6c.24 0 .47.03.7.08V9.3a6.34 6.34 0 0 0-.7-.04 6.37 6.37 0 0 0-6.37 6.37c0 3.1 2.24 5.65 5.2 6.12a6.35 6.35 0 0 0 7.53-6.12V8.74a8.22 8.22 0 0 0 4.8 1.51v-3.5a4.7 4.7 0 0 1-.64-.06Z" />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold">@brandrise.online</div>
                  <div className="text-sm text-slate-400">Behind the scenes</div>
                </div>
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-800/60 p-7 sm:p-9">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="mt-5 text-2xl font-bold">Your message is ready!</h3>
                <p className="mt-2 text-slate-300">
                  WhatsApp has opened — just press <span className="font-semibold">Send</span>.
                </p>
                <a
                  href=""
                  onClick={(e) => { e.preventDefault(); setSent(false); }}
                  className="mt-6 text-sm font-semibold text-violet-400 hover:text-violet-300"
                >
                  ← Send another request
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Your name</label>
                  <input
                    required
                    className={inputCls}
                    placeholder="e.g. Ali Raza"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Business name</label>
                  <input
                    required
                    className={inputCls}
                    placeholder="e.g. Golden Bites Café"
                    value={form.business}
                    onChange={(e) => setForm({ ...form, business: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Phone / WhatsApp number</label>
                  <input
                    required
                    className={inputCls}
                    placeholder="e.g. 0300 1234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">What do you need?</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    placeholder="Website? WhatsApp automation? Both?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90"
                >
                  Send via WhatsApp →
                </button>
                <p className="text-center text-xs text-slate-400">
                  The form opens WhatsApp — no signup, completely simple.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}