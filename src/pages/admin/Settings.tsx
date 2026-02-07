import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { useAllSettings, useUpdateSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Settings = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useAllSettings();
  const updateSettings = useUpdateSettings();
  
  const [company, setCompany] = useState<Record<string, string>>({});
  const [contacts, setContacts] = useState<Record<string, string>>({});
  const [social, setSocial] = useState<Record<string, string>>({});
  const [seo, setSeo] = useState<Record<string, string>>({});
  const [integrations, setIntegrations] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      settings.forEach(s => {
        const value = s.value as Record<string, string>;
        switch (s.key) {
          case 'company': setCompany(value || {}); break;
          case 'contacts': setContacts(value || {}); break;
          case 'social': setSocial(value || {}); break;
          case 'seo': setSeo(value || {}); break;
          case 'integrations': setIntegrations(value || {}); break;
        }
      });
    }
  }, [settings]);

  const handleSave = async (key: string, value: Record<string, string>) => {
    setIsSaving(true);
    try {
      await updateSettings.mutateAsync({ key, value });
      toast({ title: "Настройки сохранены" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Настройки</h1>
        <p className="text-muted-foreground">
          Управление глобальными настройками сайта
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full">
          <TabsTrigger value="company">Компания</TabsTrigger>
          <TabsTrigger value="contacts">Контакты</TabsTrigger>
          <TabsTrigger value="social">Соцсети</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>

        {/* Company */}
        <TabsContent value="company">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Название компании</Label>
              <Input
                value={company.name || ''}
                onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Слоган</Label>
              <Textarea
                value={company.tagline || ''}
                onChange={(e) => setCompany(prev => ({ ...prev, tagline: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>URL логотипа</Label>
              <Input
                value={company.logo_url || ''}
                onChange={(e) => setCompany(prev => ({ ...prev, logo_url: e.target.value }))}
              />
            </div>
            <Button onClick={() => handleSave('company', company)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </Card>
        </TabsContent>

        {/* Contacts */}
        <TabsContent value="contacts">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Телефон (отображение)</Label>
              <Input
                value={contacts.phone || ''}
                onChange={(e) => setContacts(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+7 (927) 080-95-67"
              />
            </div>
            <div className="space-y-2">
              <Label>Телефон (ссылка)</Label>
              <Input
                value={contacts.phone_link || ''}
                onChange={(e) => setContacts(prev => ({ ...prev, phone_link: e.target.value }))}
                placeholder="+79270809567"
              />
            </div>
            <div className="space-y-2">
              <Label>Адрес</Label>
              <Textarea
                value={contacts.address || ''}
                onChange={(e) => setContacts(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={contacts.email || ''}
                onChange={(e) => setContacts(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <Button onClick={() => handleSave('contacts', contacts)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </Card>
        </TabsContent>

        {/* Social */}
        <TabsContent value="social">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                value={social.whatsapp || ''}
                onChange={(e) => setSocial(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="https://wa.me/79270809567"
              />
            </div>
            <div className="space-y-2">
              <Label>Telegram</Label>
              <Input
                value={social.telegram || ''}
                onChange={(e) => setSocial(prev => ({ ...prev, telegram: e.target.value }))}
                placeholder="https://t.me/+79270809567"
              />
            </div>
            <div className="space-y-2">
              <Label>VK</Label>
              <Input
                value={social.vk || ''}
                onChange={(e) => setSocial(prev => ({ ...prev, vk: e.target.value }))}
                placeholder="https://vk.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                value={social.instagram || ''}
                onChange={(e) => setSocial(prev => ({ ...prev, instagram: e.target.value }))}
                placeholder="https://instagram.com/..."
              />
            </div>
            <Button onClick={() => handleSave('social', social)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Title (заголовок страницы)</Label>
              <Input
                value={seo.title || ''}
                onChange={(e) => setSeo(prev => ({ ...prev, title: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Рекомендуемая длина: до 60 символов</p>
            </div>
            <div className="space-y-2">
              <Label>Description (мета-описание)</Label>
              <Textarea
                value={seo.description || ''}
                onChange={(e) => setSeo(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Рекомендуемая длина: до 160 символов</p>
            </div>
            <div className="space-y-2">
              <Label>Keywords (ключевые слова)</Label>
              <Input
                value={seo.keywords || ''}
                onChange={(e) => setSeo(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="Через запятую"
              />
            </div>
            <Button onClick={() => handleSave('seo', seo)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>Telegram Bot Token</Label>
              <Input
                type="password"
                value={integrations.telegram_bot_token || ''}
                onChange={(e) => setIntegrations(prev => ({ ...prev, telegram_bot_token: e.target.value }))}
                placeholder="123456789:AABBccDDee..."
              />
              <p className="text-xs text-muted-foreground">Токен от @BotFather для отправки уведомлений</p>
            </div>
            <div className="space-y-2">
              <Label>Telegram Chat ID</Label>
              <Input
                value={integrations.telegram_chat_id || ''}
                onChange={(e) => setIntegrations(prev => ({ ...prev, telegram_chat_id: e.target.value }))}
                placeholder="123456789"
              />
              <p className="text-xs text-muted-foreground">ID чата для получения уведомлений</p>
            </div>
            <Button onClick={() => handleSave('integrations', integrations)} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Сохранение..." : "Сохранить"}
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
