export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            Karachi, Pakistan · Web + AI Automation
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
            Turn your local business into a{" "}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              brand that sells online.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            We build modern websites, WhatsApp automation and AI lead-gen systems
            for local businesses across Pakistan — so your customers find you on
            Google, by phone, and on WhatsApp.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 sm:w-auto"
            >
              Get Your Website
            </a>
            <a
              href="#portfolio"
              className="w-full rounded-full border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition hover:border-violet-400 hover:text-violet-600 sm:w-auto"
            >
              View Portfolio
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4 border-t border-slate-200 pt-8 text-center">
            {[
              ["10+", "Businesses Helped"],
              ["48hr", "Avg. Site Delivery"],
              ["100%", "Mobile Friendly"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  {num}
                </div>
                <div className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}