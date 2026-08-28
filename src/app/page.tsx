import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { HowToBuy } from "@/components/HowToBuy";
import { Trajectory } from "@/components/Trajectory";
import { ValueProps } from "@/components/ValueProps";
import { Products } from "@/components/Products";
import { WhyUs } from "@/components/WhyUs";
import { Reviews } from "@/components/Reviews";
import { BlogPreview } from "@/components/BlogPreview";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Stats />
        <HowToBuy />
        <Products />
        <Trajectory />
        <ValueProps />
        <WhyUs />
        <Reviews />
        <BlogPreview />
        <Faq showViewAll />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
