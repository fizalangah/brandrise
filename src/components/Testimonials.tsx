const testimonials = [
  {
    quote:
      "Our website went live in 4 days. Customers now see our menu and order directly on WhatsApp. Leads doubled in the first month.",
    name: "Ahmad Khan",
    business: "Golden Bites Café, Gulshan",
    initials: "AK",
    gradient: "from-amber-500 to-rose-500",
  },
  {
    quote:
      "The booking-through-WhatsApp system is a game changer for us. No more missed calls — clients book online and we get the details automatically.",
    name: "Sana Malik",
    business: "Glow & Grace Salon, Clifton",
    initials: "SM",
    gradient: "from-pink-500 to-violet-500",
  },
  {
    quote:
      "Affordable, professional and on time. The AI chatbot answers parents' common questions in Urdu, so we save hours every week.",
    name: "Bilal Ahmed",
    business: "Bright Minds Academy, DHA",
    initials: "BA",
    gradient: "from-sky-500 to-indigo-500",
  },
];

const Stars = () => (
  <div className="flex gap-0.5 text-amber-400">
    {[...Array(5)].map((_, i) => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-violet-600">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Businesses that <span className="text-violet-600">grew</span> with BrandRise
          </h2>
          <p className="mt-4 text-slate-600">
            Real results for real local businesses — websites that win customers.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-sm font-bold text-white`}
                >
                  {t.initials}
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.business}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}