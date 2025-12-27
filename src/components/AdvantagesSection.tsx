import { UserCheck, Target, MapPinned, Smartphone } from "lucide-react";

const advantages = [
  {
    icon: UserCheck,
    title: "Индивидуальная работа",
    description: "Работаем с каждым клиентом лично, без «конвейерного» подхода. Внимание к деталям вашего дела.",
  },
  {
    icon: Target,
    title: "Ориентация на цели",
    description: "Понимаем, для чего вам нужна оценка — банк, суд, нотариат — и готовим отчёт под конкретную задачу.",
  },
  {
    icon: MapPinned,
    title: "Знание местного рынка",
    description: "Глубокое понимание рынка недвижимости и имущества Дюртюлей и всей Республики Башкортостан.",
  },
  {
    icon: Smartphone,
    title: "Удалённое оформление",
    description: "Возможность оформить часть документов дистанционно — по телефону, мессенджерам, электронной почте.",
  },
];

const AdvantagesSection = () => {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Почему мы</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Преимущества ИП Кабирова А.Р.
          </h2>
          <p className="text-muted-foreground">
            Профессиональный подход к каждому клиенту
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="flex gap-5 p-6 bg-card rounded-xl border border-border/50 card-shadow hover:card-shadow-hover transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                <advantage.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{advantage.title}</h3>
                <p className="text-muted-foreground">{advantage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
