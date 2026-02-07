import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin, MessageCircle, Send, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateSubmission } from "@/hooks/useSubmissions";
import { useSettings } from "@/hooks/useSettings";
import { useContent } from "@/hooks/useContent";
import { 
  IntegrationsSettings, 
  EvaluationTypesSettings, 
  ContactsContent,
  ContactSettings,
  SocialSettings 
} from "@/types/content";

const DEFAULT_EVALUATION_TYPES = [
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

const CONTACTS_FALLBACK: ContactsContent = {
  badge: "Контакты",
  title: "Оставьте заявку",
  description: "Свяжемся с вами, уточним задачу и назовём стоимость оценки",
  form_title: "Форма заявки",
  phone: "+7 (927) 080-95-67",
  phone_link: "+79270809567",
  address: "РБ, г. Дюртюли, ул. Ленина, д. 8, оф. 202",
  whatsapp_link: "https://wa.me/79270809567",
  telegram_link: "https://t.me/+79270809567",
  map_embed_url: ""
};

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
};

const ContactSection = () => {
  const { toast } = useToast();
  const createSubmission = useCreateSubmission();
  
  // Load content and settings from database
  const { content, isVisible } = useContent<ContactsContent>('contacts', CONTACTS_FALLBACK);
  const { settings: integrations } = useSettings<IntegrationsSettings>('integrations', {
    telegram_bot_token: '',
    telegram_chat_id: ''
  });
  const { settings: evalTypesSettings } = useSettings<EvaluationTypesSettings>('evaluation_types', { 
    items: DEFAULT_EVALUATION_TYPES 
  });
  const { settings: contactSettings } = useSettings<ContactSettings>('contacts', {
    phone: '+7 (927) 080-95-67',
    phone_link: '+79270809567',
    address: 'РБ, г. Дюртюли, ул. Ленина, д. 8, оф. 202',
    email: ''
  });
  const { settings: socialSettings } = useSettings<SocialSettings>('social', {
    whatsapp: 'https://wa.me/79270809567',
    telegram: 'https://t.me/+79270809567',
    vk: '',
    instagram: ''
  });
  
  const evaluationTypes = evalTypesSettings.items || DEFAULT_EVALUATION_TYPES;
  
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
    if (!integrations.telegram_bot_token || !integrations.telegram_chat_id) {
      return false;
    }
    
    const typeName = evaluationTypes.find(t => t.value === data.type)?.label || data.type || "Не указан";
    const message = `🆕 Новая заявка с сайта!\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone}\n📋 Тип оценки: ${typeName}\n💬 Комментарий: ${data.comment || "Не указан"}`;
    
    try {
      const url = `https://api.telegram.org/bot${integrations.telegram_bot_token}/sendMessage?chat_id=${integrations.telegram_chat_id}&text=${encodeURIComponent(message)}`;
      const response = await fetch(url, { method: "GET" });
      const result = await response.json();
      return result.ok === true;
    } catch (error) {
      console.error("Telegram error:", error);
      return false;
    }
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
    
    const typeName = evaluationTypes.find(t => t.value === formData.type)?.label || formData.type;

    try {
      // Save to database
      await createSubmission.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        evaluation_type: formData.type || undefined,
        evaluation_type_label: typeName || undefined,
        comment: formData.comment || undefined,
      });
      
      // Send to Telegram (non-blocking)
      sendToTelegram(formData);
      
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      
      setFormData({ name: "", phone: "", type: "", comment: "" });
      refreshCaptcha();
    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <section id="contacts" className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">{content.badge}</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-foreground mt-2 mb-4">
            {content.title}
          </h2>
          <p className="text-muted-foreground">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-6 lg:p-8 border border-border/50 card-shadow">
            <h3 className="text-xl font-heading font-bold text-foreground mb-6">{content.form_title}</h3>
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
                    {evaluationTypes.map((type) => (
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
                <a href={`tel:${contactSettings.phone_link}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <p className="font-semibold text-foreground">{contactSettings.phone}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Адрес</p>
                    <p className="font-semibold text-foreground">{contactSettings.address}</p>
                  </div>
                </div>
              </div>

              {/* Messenger Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
                {socialSettings.whatsapp && (
                  <a href={socialSettings.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="whatsapp" size="lg" className="w-full">
                      <MessageCircle className="w-5 h-5" />
                      Написать в WhatsApp
                    </Button>
                  </a>
                )}
                {socialSettings.telegram && (
                  <a href={socialSettings.telegram} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="telegram" size="lg" className="w-full">
                      <Send className="w-5 h-5" />
                      Написать в Telegram
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Map */}
            {content.map_embed_url && (
              <div className="bg-card rounded-2xl overflow-hidden border border-border/50 card-shadow h-64 lg:h-72">
                <iframe
                  src={content.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Офис в Дюртюлях"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
