import { Building2, Car, Wrench, Briefcase, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import RequestFormDialog from "@/components/RequestFormDialog";

const services = [
  {
    icon: Building2,
    title: "Оценка недвижимости",
    description: "Квартиры, дома, комнаты, земельные участки, коммерческая недвижимость",
    purposes: ["Банк и ипотека", "Нотариус", "Суд", "Купля-продажа"],
  },
  {
    icon: Car,
    title: "Оценка транспорта",
    description: "Легковые и грузовые автомобили, спецтехника, мотоциклы",
    purposes: ["Страховая", "ДТП", "Залог", "Наследство"],
  },
  {
    icon: Wrench,
    title: "Оценка оборудования",
    description: "Производственное оборудование, станки, движимое имущество",
    purposes: ["Залог", "Бухучёт", "Сделки", "Банк"],
  },
  {
    icon: Briefcase,
    title: "Оценка бизнеса и долей",
    description: "Оценка стоимости предприятий, долей участия в ООО",
    purposes: ["Продажа", "Раздел", "Суд", "Инвестиции"],
  },
  {
    icon: AlertTriangle,
    title: "Оценка ущерба",
    description: "Залив, пожар, ДТП, порча имущества третьими лицами",
    purposes: ["Суд", "Страховая", "Претензия", "Возмещение"],
  },
  {
    icon: Users,
    title: "Оценка для наследства",
    description: "Оценка для нотариуса при вступлении в наследство, дарении, разделе",
    purposes: ["Нотариус", "Суд", "Дарение", "Раздел"],
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Наши услуги</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Какие объекты оцениваем
          </h2>
          <p className="text-muted-foreground">
            Профессиональная оценка любых видов имущества для физических и юридических лиц
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border/50 flex flex-col h-full"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{service.description}</p>

              {/* Purpose Tags */}
              <div className="flex flex-wrap gap-2 mb-4 flex-grow">
                {service.purposes.map((purpose, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary rounded-full h-fit"
                  >
                    {purpose}
                  </span>
                ))}
              </div>

              {/* Order Button */}
              <RequestFormDialog 
                trigger={
                  <Button variant="outline" size="sm" className="w-full mt-auto">
                    Заказать оценку
                  </Button>
                }
                defaultService={service.title}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
