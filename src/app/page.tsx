import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Trajectory } from "@/components/Trajectory";
import { ValueProps } from "@/components/ValueProps";
import { Products } from "@/components/Products";
import { WhyUs } from "@/components/WhyUs";
import { TrustedBrands } from "@/components/TrustedBrands";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Trajectory />
        <ValueProps />
        <Products />
        <WhyUs />
        <TrustedBrands />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
