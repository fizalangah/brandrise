const steps = [
  {
    num: "01",
    title: "Free Consultation",
    desc: "We learn about your business on WhatsApp — what you need, your budget and your priorities.",
  },
  {
    num: "02",
    title: "Design & Build",
    desc: "Your website's first version is ready within 48 hours — we show you, take your feedback and refine it.",
  },
  {
    num: "03",
    title: "Automation Setup",
    desc: "WhatsApp auto-reply, booking system, AI chatbot — all configured around your business.",
  },
  {
    num: "04",
    title: "Go Live & Support",
    desc: "Domain and hosting are set up and your site goes live. Updates and maintenance are handled by us.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Online in <span className="text-violet-600">4 simple steps</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-4xl font-black text-violet-100">{s.num}</div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}