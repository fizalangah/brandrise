const services = [
  {
    icon: "M3 10h18M5 6h14M5 14h14M5 18h10",
    title: "Business Websites",
    desc: "Fast, responsive websites for restaurants, salons, boutiques, coaching centres and every local business — ready with a WhatsApp order button.",
    color: "from-violet-600 to-purple-500",
  },
  {
    icon: "M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Zm-9 2.5V12l-2-1.5M21 3l-1.5 1.5M16.9 5.1l1.4 1.4",
    title: "WhatsApp Automation",
    desc: "Auto-replies, order booking and appointment reminders — your WhatsApp answers customers 24/7, straight from your real number.",
    color: "from-emerald-600 to-teal-500",
  },
  {
    icon: "M4 13h16M4 9h16M4 17h10M12 21l2-3h5l-2 3M9 3l1.5 4M11 3l1.5 5",
    title: "AI Chatbots",
    desc: "An AI chatbot on your website that answers customer questions and captures leads — big results on a small budget.",
    color: "from-fuchsia-600 to-pink-500",
  },
  {
    icon: "M3 15a9 9 0 1 1 13 7.5M3 15 20 5M3 15l7 2 10-12",
    title: "Lead Generation Systems",
    desc: "Smart forms, Google Maps listings and landing pages that turn visitors into paying customers.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: "M17 9V7a5 5 0 0 0-10 0v2M5 9h14v10H5z",
    title: "Social Media Integration",
    desc: "Link Instagram, TikTok and WhatsApp to your website — your whole online presence in one organised place.",
    color: "from-sky-600 to-blue-500",
  },
  {
    icon: "M12 3l9 5-9 5-9-5 9-5Zm0 8v10M12 11l9-3v8l-9 5-9-5V8l9 3Z",
    title: "Growth & Maintenance",
    desc: "Domain, hosting, updates and SEO — all handled for you. You just focus on your business.",
    color: "from-rose-600 to-red-500",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Services
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything that takes your business <span className="text-violet-600">forward</span> online
          </h2>
          <p className="mt-4 text-slate-600">
            From websites to automation — affordable packaged solutions for
            small businesses.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-md`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={s.icon} />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}