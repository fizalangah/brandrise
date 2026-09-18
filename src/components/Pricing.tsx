const plans = [
  {
    name: "Starter",
    price: "15,000",
    tag: "Website",
    features: [
      "Single-page professional website",
      "Mobile-first design",
      "WhatsApp order/contact button",
      "Google Maps embed",
      "Free hosting setup",
      "1 week delivery",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "35,000",
    tag: "Website + Automation",
    features: [
      "Multi-page website (up to 5 pages)",
      "Lead capture form + email alerts",
      "WhatsApp auto-reply bot",
      "Instagram/TikTok link integration",
      "Basic SEO setup",
      "3-day delivery",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    price: "60,000",
    tag: "Website + AI + Automation",
    features: [
      "Custom multi-page website",
      "AI chatbot (24/7 answers)",
      "Booking/appointment system",
      "Google Business + Maps listing",
      "1 month maintenance included",
      "Priority support",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            A plan for <span className="text-violet-600">every budget</span>
          </h2>
          <p className="mt-4 text-slate-600">
            Affordable packages in Pakistani rupees — far less than agencies,
            because we&apos;re built for local small businesses.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-7 shadow-sm ${
                p.highlighted
                  ? "border-violet-500 bg-slate-900 text-white shadow-xl"
                  : "border-slate-200 bg-white"
              }`}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-1 text-xs font-bold text-white">
                  Most Popular
                </span>
              )}
              <div className={`text-sm font-semibold ${p.highlighted ? "text-violet-300" : "text-violet-600"}`}>
                {p.name} · {p.tag}
              </div>
              <div className="mt-3 flex items-end gap-1">
                <span className="text-4xl font-extrabold">Rs {p.price}</span>
                <span className={`mb-1 text-sm ${p.highlighted ? "text-slate-400" : "text-slate-500"}`}>
                  / one-time
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`mt-0.5 ${p.highlighted ? "text-emerald-400" : "text-emerald-500"}`}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className={p.highlighted ? "text-slate-200" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`mt-8 rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
                  p.highlighted
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:opacity-90"
                    : "border border-slate-300 text-slate-700 hover:border-violet-400 hover:text-violet-600"
                }`}
              >
                Choose {p.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}