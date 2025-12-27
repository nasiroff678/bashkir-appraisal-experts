import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Сколько стоит оценка квартиры/дома/авто? От чего зависит цена?",
    answer: "Стоимость оценки зависит от типа объекта, его местоположения, площади и цели оценки. Оценка квартиры начинается от 3000 рублей, дома — от 5000 рублей, автомобиля — от 2500 рублей. Точную стоимость назовём после уточнения деталей вашей задачи.",
  },
  {
    question: "Сколько времени занимает подготовка отчёта?",
    answer: "Стандартный срок подготовки отчёта — от 1 до 5 рабочих дней в зависимости от сложности объекта и загруженности. При срочной необходимости возможна ускоренная подготовка за дополнительную плату.",
  },
  {
    question: "Принимают ли отчёт банки, суды, нотариусы?",
    answer: "Да, все наши отчёты соответствуют требованиям Федерального закона №135-ФЗ «Об оценочной деятельности» и Федеральных стандартов оценки. Отчёты принимаются банками, судами, нотариусами и другими организациями.",
  },
  {
    question: "Какие документы нужны для оценки квартиры/авто/земли?",
    answer: "Для оценки недвижимости: свидетельство о праве собственности или выписка из ЕГРН, технический паспорт. Для оценки авто: ПТС, СТС. Для земельного участка: документы на землю и кадастровый паспорт. Полный перечень уточняем индивидуально.",
  },
  {
    question: "Можно ли заказать оценку, если нахожусь в другом городе?",
    answer: "Да, возможно. Часть документов можно оформить дистанционно через мессенджеры и электронную почту. При необходимости осмотра объекта договариваемся о времени выезда или просим прислать фото/видео материалы.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 lg:py-24">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Вопросы и ответы</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Ответы на частые вопросы
          </h2>
          <p className="text-muted-foreground">
            Не нашли ответ? Свяжитесь с нами — проконсультируем бесплатно
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border/50 rounded-xl px-6 card-shadow"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
