import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin, MessageCircle, Send, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EVALUATION_TYPES = [
  { value: "apartment", label: "Оценка квартиры" },
  { value: "house", label: "Оценка дома" },
  { value: "land", label: "Оценка земельного участка" },
  { value: "commercial", label: "Оценка коммерческой недвижимости" },
  { value: "car", label: "Оценка автомобиля" },
  { value: "equipment", label: "Оценка оборудования" },
  { value: "business", label: "Оценка бизнеса" },
  { value: "damage", label: "Оценка ущерба" },
  { value: "inheritance", label: "Оценка для наследства" },
  { value: "other", label: "Другое" },
];

const TELEGRAM_BOT_TOKEN = "8223684027:AAGkaI_YewHQUeoSaZ2EqfLVOnmvKhRSIv8";
const TELEGRAM_CHAT_ID = "8271729626";

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
};

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "",
    comment: "",
  });
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  const sendToTelegram = async (data: typeof formData) => {
    const typeName = EVALUATION_TYPES.find(t => t.value === data.type)?.label || data.type || "Не указан";
    const message = `🆕 Новая заявка с сайта!\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone}\n📋 Тип оценки: ${typeName}\n💬 Комментарий: ${data.comment || "Не указан"}`;
    
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(message)}`;
      const response = await fetch(url, { method: "GET" });
      const result = await response.json();
      return result.ok === true;
    } catch (error) {
      console.error("Telegram error:", error);
      return false;
    }
  };

  const saveToLocalStorage = (data: typeof formData) => {
    const submissions = JSON.parse(localStorage.getItem("formSubmissions") || "[]");
    const newSubmission = {
      ...data,
      id: Date.now(),
      date: new Date().toISOString(),
      typeName: EVALUATION_TYPES.find(t => t.value === data.type)?.label || data.type
    };
    submissions.push(newSubmission);
    localStorage.setItem("formSubmissions", JSON.stringify(submissions));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(captchaInput) !== captcha.answer) {
      toast({
        title: "Ошибка капчи",
        description: "Неверный ответ. Попробуйте снова.",
        variant: "destructive"
      });
      refreshCaptcha();
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Save to localStorage for admin panel
    saveToLocalStorage(formData);

    // Send to Telegram
    const telegramSent = await sendToTelegram(formData);

    setIsSubmitting(false);

    if (telegramSent) {
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
    } else {
      toast({
        title: "Заявка сохранена",
        description: "Мы получили вашу заявку и скоро свяжемся.",
      });
    }

    setFormData({ name: "", phone: "", type: "", comment: "" });
    refreshCaptcha();
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
                <label className="block text-sm font-medium text-foreground mb-1.5">Ваше имя *</label>
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
                <label className="block text-sm font-medium text-foreground mb-1.5">Телефон *</label>
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
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="h-12 bg-background">
                    <SelectValue placeholder="Выберите тип оценки" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    {EVALUATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              {/* Captcha */}
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Подтвердите, что вы не робот *
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-foreground bg-background px-3 py-2 rounded border border-border">
                    {captcha.num1} + {captcha.num2} = ?
                  </span>
                  <Input
                    type="number"
                    placeholder="Ответ"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    required
                    className="h-10 w-24"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={refreshCaptcha}
                    className="h-10 w-10"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
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
