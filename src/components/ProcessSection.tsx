import { PhoneCall, FileSearch, MapPin, Calculator, FileCheck } from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    number: "01",
    title: "Звонок или заявка",
    description: "Свяжитесь с нами через сайт или по телефону. Проведём краткую консультацию.",
  },
  {
    icon: FileSearch,
    number: "02",
    title: "Сбор документов",
    description: "Соберём информацию и документы, согласуем стоимость и сроки работы.",
  },
  {
    icon: MapPin,
    number: "03",
    title: "Осмотр объекта",
    description: "При необходимости выезжаем в Дюртюли и по всей Республике Башкортостан.",
  },
  {
    icon: Calculator,
    number: "04",
    title: "Расчёты и анализ",
    description: "Проводим расчёты и готовим отчёт в соответствии с требованиями.",
  },
  {
    icon: FileCheck,
    number: "05",
    title: "Передача отчёта",
    description: "Передаём отчёт в бумажном и/или электронном виде с пояснениями.",
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Процесс работы</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Как проходит работа
          </h2>
          <p className="text-muted-foreground">
            Прозрачный процесс от заявки до получения готового отчёта
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-secondary/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Number & Icon */}
                <div className="relative inline-block mb-5">
                  <div className="w-20 h-20 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center mx-auto card-shadow relative z-10">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
