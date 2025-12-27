import { Landmark, Scale, FileText, ShoppingBag, Shield } from "lucide-react";

const purposes = [
  {
    icon: Landmark,
    title: "Для банка и ипотеки",
    description: "Отчёт для получения ипотечного кредита или залога недвижимости",
  },
  {
    icon: FileText,
    title: "Для нотариуса",
    description: "Наследство, дарение, вступление в наследство — официальный отчёт",
  },
  {
    icon: Scale,
    title: "Для суда",
    description: "Судебные споры, раздел имущества, споры по ущербу",
  },
  {
    icon: ShoppingBag,
    title: "Для сделок",
    description: "Купля-продажа, обмен, определение рыночной стоимости",
  },
  {
    icon: Shield,
    title: "Для страховых выплат",
    description: "Расчёт ущерба для страховой компании, возмещение убытков",
  },
];

const PurposesSection = () => {
  return (
    <section id="purposes" className="py-16 lg:py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Цели оценки</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Для каких целей нужна оценка
          </h2>
          <p className="text-muted-foreground">
            Независимый отчёт об оценке принимается всеми организациями
          </p>
        </div>

        {/* Purposes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {purposes.map((purpose, index) => (
            <div
              key={index}
              className="text-center group"
            >
              {/* Icon Circle */}
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                <purpose.icon className="w-9 h-9 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">{purpose.title}</h3>
              <p className="text-sm text-muted-foreground">{purpose.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PurposesSection;
