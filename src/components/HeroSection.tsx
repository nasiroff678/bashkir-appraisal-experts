import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const advantages = [
    "Отчёты соответствуют законодательству РФ",
    "Опыт работы и знание региона Башкортостана",
    "Работа с физическими и юридическими лицами",
    "Индивидуальный подход и понятные цены",
  ];

  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            Независимая экспертная оценка
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Независимая оценка имущества{" "}
            <span className="text-gradient">в Дюртюлях</span> и по всей{" "}
            <span className="text-gradient">Республике Башкортостан</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Отчёты для суда, банка, нотариуса, сделок и страховых компаний. 
            Законно, объективно, в согласованные сроки.
          </p>

          {/* Advantages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {advantages.map((advantage, index) => (
              <div key={index} className="flex items-center gap-2 text-left">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-sm lg:text-base text-foreground">{advantage}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <a href="#contacts">
              <Button variant="hero" size="xl">
                Рассчитать стоимость оценки
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <a href="tel:+79270809567">
              <Button variant="outline" size="xl">
                Позвонить сейчас
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
