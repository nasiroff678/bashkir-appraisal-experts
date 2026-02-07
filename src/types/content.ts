// TypeScript types for CMS content

// ============= Section Content Types =============

export interface HeroContent {
  badge: string;
  heading: string;
  heading_highlight_1: string;
  heading_highlight_2: string;
  subheading: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  advantages: string[];
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  purposes: string[];
}

export interface ServicesContent {
  badge: string;
  title: string;
  description: string;
  items: ServiceItem[];
}

export interface PurposeItem {
  icon: string;
  title: string;
  description: string;
}

export interface PurposesContent {
  badge: string;
  title: string;
  description: string;
  items: PurposeItem[];
}

export interface ObjectType {
  value: string;
  label: string;
  icon: string;
  price_min: number;
  price_max: number;
}

export interface PurposeType {
  value: string;
  label: string;
  multiplier?: number;
}

export interface CalculatorContent {
  badge: string;
  title: string;
  description: string;
  disclaimer: string;
  object_types: ObjectType[];
  purposes: PurposeType[];
}

export interface ProcessStep {
  icon: string;
  number: string;
  title: string;
  description: string;
}

export interface ProcessContent {
  badge: string;
  title: string;
  description: string;
  steps: ProcessStep[];
}

export interface AdvantageItem {
  icon: string;
  title: string;
  description: string;
}

export interface AdvantagesContent {
  badge: string;
  title: string;
  description: string;
  items: AdvantageItem[];
}

export interface CaseItem {
  title: string;
  situation: string;
  action: string;
  result: string;
}

export interface CasesContent {
  badge: string;
  title: string;
  description: string;
  items: CaseItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  badge: string;
  title: string;
  description: string;
  items: FAQItem[];
}

export interface ContactsContent {
  badge: string;
  title: string;
  description: string;
  form_title: string;
  phone: string;
  phone_link: string;
  address: string;
  whatsapp_link: string;
  telegram_link: string;
  map_embed_url: string;
}

// ============= Site Settings Types =============

export interface CompanySettings {
  name: string;
  tagline: string;
  logo_url: string;
}

export interface ContactSettings {
  phone: string;
  phone_link: string;
  address: string;
  email: string;
}

export interface SocialSettings {
  whatsapp: string;
  telegram: string;
  vk: string;
  instagram: string;
}

export interface IntegrationsSettings {
  telegram_bot_token: string;
  telegram_chat_id: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
}

export interface EvaluationType {
  value: string;
  label: string;
}

export interface EvaluationTypesSettings {
  items: EvaluationType[];
}

// ============= Navigation Types =============

export interface NavigationItem {
  id: string;
  location: 'header' | 'footer' | 'mobile';
  label: string;
  href: string;
  sort_order: number;
  is_visible: boolean;
  icon?: string;
  open_in_new_tab: boolean;
}

// ============= Form Submission Types =============

export interface FormSubmission {
  id: string;
  name: string;
  phone: string;
  evaluation_type: string | null;
  evaluation_type_label: string | null;
  comment: string | null;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// ============= Site Content Table Types =============

export interface SiteContent {
  id: string;
  section_name: string;
  content: Record<string, unknown>;
  is_visible: boolean;
  sort_order: number;
  updated_at: string;
  updated_by: string | null;
}

// ============= Fallback Data =============

export const HERO_FALLBACK: HeroContent = {
  badge: "Независимая экспертная оценка",
  heading: "Независимая оценка имущества",
  heading_highlight_1: "в Дюртюлях",
  heading_highlight_2: "Республике Башкортостан",
  subheading: "Отчёты для суда, банка, нотариуса, сделок и страховых компаний. Законно, объективно, в согласованные сроки.",
  cta_primary_text: "Рассчитать стоимость оценки",
  cta_secondary_text: "Позвонить сейчас",
  advantages: [
    "Отчёты соответствуют законодательству РФ",
    "Опыт работы и знание региона Башкортостана",
    "Работа с физическими и юридическими лицами",
    "Индивидуальный подход и понятные цены"
  ]
};

export const CONTACTS_FALLBACK: ContactSettings = {
  phone: "+7 (927) 080-95-67",
  phone_link: "+79270809567",
  address: "РБ, г. Дюртюли, ул. Ленина, д. 8, оф. 202",
  email: ""
};

export const COMPANY_FALLBACK: CompanySettings = {
  name: "ИП Кабиров Альмир Робертович",
  tagline: "Независимая оценка имущества в Республике Башкортостан",
  logo_url: "/assets/logo.png"
};

export const SOCIAL_FALLBACK: SocialSettings = {
  whatsapp: "https://wa.me/79270809567",
  telegram: "https://t.me/+79270809567",
  vk: "",
  instagram: ""
};
