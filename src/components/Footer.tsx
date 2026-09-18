export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-10 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
              B
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              Brand<span className="text-violet-400">Rise</span>
            </span>
          </div>
          <p className="text-center text-sm">
            © {new Date().getFullYear()} BrandRise — Websites &amp; Automation for local businesses. Karachi, Pakistan.
          </p>
          <div className="flex gap-5 text-sm">
            <a href="#services" className="transition hover:text-white">Services</a>
            <a href="#portfolio" className="transition hover:text-white">Portfolio</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#contact" className="transition hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}