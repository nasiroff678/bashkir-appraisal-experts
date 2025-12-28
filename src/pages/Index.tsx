import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PurposesSection from "@/components/PurposesSection";
import PriceCalculator from "@/components/PriceCalculator";
import ProcessSection from "@/components/ProcessSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import CasesSection from "@/components/CasesSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <PurposesSection />
        <PriceCalculator />
        <ProcessSection />
        <AdvantagesSection />
        <CasesSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
