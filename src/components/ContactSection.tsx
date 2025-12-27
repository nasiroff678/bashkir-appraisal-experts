import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "",
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    setFormData({ name: "", phone: "", type: "", comment: "" });
  };

  return (
    <section id="contacts" className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Контакты</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            Оставьте заявку
          </h2>
          <p className="text-muted-foreground">
            Свяжемся с вами, уточним задачу и назовём стоимость оценки
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border/50 card-shadow">
            <h3 className="text-xl font-heading font-bold text-foreground mb-6">Форма заявки</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Ваше имя</label>
                <Input
                  type="text"
                  placeholder="Как к вам обращаться?"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Телефон</label>
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Тип оценки</label>
                <Input
                  type="text"
                  placeholder="Например: квартира для ипотеки"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="h-12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Комментарий</label>
                <Textarea
                  placeholder="Опишите вашу задачу..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Отправить заявку
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Info Cards */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 card-shadow">
              <h3 className="text-xl font-heading font-bold text-foreground mb-5">Контактная информация</h3>
              
              <div className="space-y-4">
                <a href="tel:+79270809567" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="font-semibold text-foreground">+7 (927) 080-95-67</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Адрес</p>
                    <p className="font-semibold text-foreground">РБ, г. Дюртюли, ул. Ленина, д. 8, оф. 202</p>
                  </div>
                </div>
              </div>

              {/* Messenger Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
                <a href="https://wa.me/79270809567" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="whatsapp" size="lg" className="w-full">
                    <MessageCircle className="w-5 h-5" />
                    Написать в WhatsApp
                  </Button>
                </a>
                <a href="https://t.me/+79270809567" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="telegram" size="lg" className="w-full">
                    <Send className="w-5 h-5" />
                    Написать в Telegram
                  </Button>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border/50 card-shadow h-64 lg:h-72">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2205.5!2d55.4869!3d55.4942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDI5JzM5LjEiTiA1NcKwMjknMTIuOCJF!5e0!3m2!1sru!2sru!4v1609459200000!5m2!1sru!2sru"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Офис в Дюртюлях"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
