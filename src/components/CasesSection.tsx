import { CheckCircle2 } from "lucide-react";

const cases = [
  {
    title: "Оценка квартиры для ипотеки",
    situation: "Клиенту требовалась оценка двухкомнатной квартиры в Дюртюлях для получения ипотечного кредита в банке.",
    action: "Провели осмотр квартиры, собрали документы, подготовили отчёт в соответствии с требованиями банка.",
    result: "Отчёт принят банком без замечаний, клиент получил одобрение ипотеки в течение недели.",
  },
  {
    title: "Оценка дома для нотариуса",
    situation: "Наследники обратились для оценки жилого дома и земельного участка при вступлении в наследство.",
    action: "Выехали на осмотр объекта, изучили правоустанавливающие документы, определили рыночную стоимость.",
    result: "Нотариус принял отчёт, наследники успешно оформили право собственности.",
  },
  {
    title: "Оценка автомобиля после ДТП",
    situation: "После ДТП страховая занизила выплату. Владелец обратился для независимой оценки ущерба.",
    action: "Провели осмотр повреждённого автомобиля, рассчитали реальный размер ущерба по рыночным ценам.",
    result: "С отчётом клиент обратился в суд и получил полное возмещение ущерба.",
  },
  {
    title: "Оценка коммерческого помещения",
    situation: "Предприниматель готовил магазин к залогу для получения кредита на развитие бизнеса.",
    action: "Оценили коммерческое помещение с учётом местоположения, арендного потенциала и состояния.",
    result: "Банк одобрил кредит под залог помещения на основании нашего отчёта.",
  },
];

const CasesSection = () => {
  return (
    <section id="cases" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Примеры работ</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Примеры задач
          </h2>
          <p className="text-muted-foreground">
            Типовые сценарии работы с клиентами
          </p>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((caseItem, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border/50 card-shadow hover:card-shadow-hover transition-all duration-300"
            >
              <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gradient-hero text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                {caseItem.title}
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-semibold text-primary">Ситуация:</span>
                  <p className="text-sm text-muted-foreground mt-1">{caseItem.situation}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-secondary">Что сделали:</span>
                  <p className="text-sm text-muted-foreground mt-1">{caseItem.action}</p>
                </div>
                <div className="flex gap-2 items-start pt-2 border-t border-border">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-foreground">{caseItem.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CasesSection;
