import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateSubmission } from "@/hooks/useSubmissions";
import { useSettings } from "@/hooks/useSettings";
import { IntegrationsSettings, EvaluationTypesSettings } from "@/types/content";

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

const generateCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { num1, num2, answer: num1 + num2 };
};

interface RequestFormDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  defaultService?: string;
}

const RequestFormDialog = ({ children, trigger, defaultService }: RequestFormDialogProps) => {
  const { toast } = useToast();
  const createSubmission = useCreateSubmission();
  
  // Load settings from database
  const { settings: integrations } = useSettings<IntegrationsSettings>('integrations', {
    telegram_bot_token: '',
    telegram_chat_id: ''
  });
  const { settings: evalTypesSettings } = useSettings<EvaluationTypesSettings>('evaluation_types', { 
    items: DEFAULT_EVALUATION_TYPES 
  });
  
  const evaluationTypes = evalTypesSettings.items || DEFAULT_EVALUATION_TYPES;
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "+7 ",
    type: defaultService || "",
    comment: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("+7")) {
      value = "+7 " + value.replace(/^\+?7?\s*/, "");
    }
    setFormData({ ...formData, phone: value });
  };
  
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && defaultService) {
      const matchedType = evaluationTypes.find(t => 
        t.label.toLowerCase().includes(defaultService.toLowerCase()) ||
        defaultService.toLowerCase().includes(t.label.toLowerCase())
      );
      if (matchedType) {
        setFormData(prev => ({ ...prev, type: matchedType.value }));
      }
    }
  };

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
      
      setFormData({ name: "", phone: "+7 ", type: "", comment: "" });
      refreshCaptcha();
      setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading font-bold">Оставить заявку</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
              onChange={handlePhoneChange}
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
              <SelectContent className="bg-background border border-border z-[60]">
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
              rows={3}
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
      </DialogContent>
    </Dialog>
  );
};

export default RequestFormDialog;
