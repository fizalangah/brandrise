import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Portfolio />
        <HowItWorks />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  );
}