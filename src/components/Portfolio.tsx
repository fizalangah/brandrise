const projects = [
  {
    name: "Golden Bites Café",
    category: "Restaurant · Website + WhatsApp Ordering",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    initials: "GB",
    url: "https://fizalangah.github.io/golden-bites/",
    demo: true,
    points: ["Menu + gallery", "WhatsApp order button", "Mobile-first design"],
  },
  {
    name: "Glow & Grace Salon",
    category: "Beauty · Multi-page · Booking + AI Chatbot",
    gradient: "from-pink-500 via-fuchsia-500 to-violet-500",
    initials: "GG",
    url: "https://fizalangah.github.io/glow-grace/",
    demo: true,
    points: ["Multi-page site (3 pages)", "Booking form → lead inbox", "WhatsApp auto-reply chatbot"],
  },
  {
    name: "Bright Minds Academy",
    category: "Coaching · Multi-page · AI Chatbot + Bookings",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    initials: "BM",
    url: "https://fizalangah.github.io/bright-minds/",
    demo: true,
    points: ["Multi-page site (3 pages)", "24/7 AI chatbot (fees/timings)", "Demo-class booking + Maps embed"],
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Portfolio
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Small businesses, <span className="text-violet-600">big</span> websites
          </h2>
          <p className="mt-4 text-slate-600">
            Projects built for local businesses across Karachi — fast, affordable
            and mobile-first.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target={p.url.startsWith("#") ? undefined : "_blank"}
              rel={p.url.startsWith("#") ? undefined : "noopener noreferrer"}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${p.gradient}`}
              >
                <div className="absolute inset-x-4 top-4 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-white/60" />
                  <span className="h-2 w-2 rounded-full bg-white/60" />
                  <span className="h-2 w-2 rounded-full bg-white/60" />
                </div>
                <span className="text-5xl font-black text-white/90">{p.initials}</span>
                <span className="absolute bottom-3 right-4 rounded-full bg-white/25 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {p.url.startsWith("#") ? "Sample ↗" : "Live Preview ↗"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <p className="mt-1 text-xs font-medium text-violet-600">{p.category}</p>
                <ul className="mt-3 space-y-1.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-emerald-500"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          All projects shown are demos to give you an idea — everything is
          custom-built for your business.
        </p>
      </div>
    </section>
  );
}