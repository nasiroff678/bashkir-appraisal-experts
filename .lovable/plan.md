
# План реализации CMS-админки с Supabase

## 1. Инвентаризация контента

### 1.1 HeroSection.tsx
| Тип данных | Значение |
|------------|----------|
| **badge** | "Независимая экспертная оценка" |
| **heading** | "Независимая оценка имущества в Дюртюлях и по всей Республике Башкортостан" |
| **subheading** | "Отчёты для суда, банка, нотариуса..." |
| **cta_primary_text** | "Рассчитать стоимость оценки" |
| **cta_secondary_text** | "Позвонить сейчас" |
| **phone_link** | "+79270809567" |
| **advantages** (массив) | 4 элемента: "Отчёты соответствуют законодательству РФ", "Опыт работы...", "Работа с физическими...", "Индивидуальный подход..." |

### 1.2 ServicesSection.tsx
| Тип данных | Значение |
|------------|----------|
| **section_badge** | "Наши услуги" |
| **section_title** | "Какие объекты оцениваем" |
| **section_description** | "Профессиональная оценка любых видов имущества..." |
| **services** (массив) | 6 услуг, каждая содержит: icon, title, description, purposes[] |

**Структура услуги:**
- icon: Building2, Car, Wrench, Briefcase, AlertTriangle, Users
- title: "Оценка недвижимости", "Оценка транспорта", и т.д.
- description: текстовое описание
- purposes: массив тегов ["Банк и ипотека", "Нотариус", ...]

### 1.3 PurposesSection.tsx
| Тип данных | Значение |
|------------|----------|
| **section_badge** | "Цели оценки" |
| **section_title** | "Для каких целей нужна оценка" |
| **section_description** | "Независимый отчёт об оценке принимается всеми организациями" |
| **purposes** (массив) | 5 целей: Landmark, FileText, Scale, ShoppingBag, Shield |

### 1.4 PriceCalculator.tsx
| Тип данных | Значение |
|------------|----------|
| **section_badge** | "Калькулятор стоимости" |
| **section_title** | "Рассчитайте примерную стоимость оценки" |
| **section_description** | "Выберите тип объекта и цель оценки..." |
| **disclaimer** | "* Указанные цены являются ориентировочными..." |
| **objectTypes** (массив) | 8 типов объектов с ценами |
| **purposes** (массив) | 6 целей оценки |

### 1.5 ProcessSection.tsx
| Тип данных | Значение |
|------------|----------|
| **section_badge** | "Процесс работы" |
| **section_title** | "Как проходит работа" |
| **section_description** | "Прозрачный процесс от заявки до получения готового отчёта" |
| **steps** (массив) | 5 шагов: PhoneCall, FileSearch, MapPin, Calculator, FileCheck |

### 1.6 AdvantagesSection.tsx
| Тип данных | Значение |
|------------|----------|
| **section_badge** | "Почему мы" |
| **section_title** | "Наши преимущества" |
| **section_description** | "Профессиональный подход к каждому клиенту" |
| **advantages** (массив) | 4 преимущества: UserCheck, Target, MapPinned, Smartphone |

### 1.7 CasesSection.tsx
| Тип данных | Значение |
|------------|----------|
| **section_badge** | "Примеры работ" |
| **section_title** | "Примеры задач" |
| **section_description** | "Типовые сценарии работы с клиентами" |
| **cases** (массив) | 4 кейса с title, situation, action, result |

### 1.8 FAQSection.tsx
| Тип данных | Значение |
|------------|----------|
| **section_badge** | "Вопросы и ответы" |
| **section_title** | "Ответы на частые вопросы" |
| **section_description** | "Не нашли ответ? Свяжитесь с нами — проконсультируем бесплатно" |
| **faqs** (массив) | 5 вопросов с question и answer |

### 1.9 ContactSection.tsx
| Тип данных | Значение |
|------------|----------|
| **section_badge** | "Контакты" |
| **section_title** | "Оставьте заявку" |
| **section_description** | "Свяжемся с вами, уточним задачу и назовём стоимость оценки" |
| **phone** | "+7 (927) 080-95-67" |
| **phone_link** | "+79270809567" |
| **address** | "РБ, г. Дюртюли, ул. Ленина, д. 8, оф. 202" |
| **whatsapp_link** | "https://wa.me/79270809567" |
| **telegram_link** | "https://t.me/+79270809567" |
| **map_embed** | Google Maps iframe URL |
| **evaluation_types** (массив) | 10 типов оценки для формы |

### 1.10 Header.tsx
| Тип данных | Значение |
|------------|----------|
| **logo** | src/assets/logo.png |
| **phone** | "+7 (927) 080-95-67" |
| **phone_link** | "+79270809567" |
| **whatsapp_link** | "https://wa.me/79270809567" |
| **navLinks** (массив) | 6 пунктов меню: #services, #purposes, #process, #cases, #faq, #contacts |

### 1.11 Footer.tsx
| Тип данных | Значение |
|------------|----------|
| **logo** | src/assets/logo.png |
| **company_name** | "ИП Кабиров Альмир Робертович" |
| **tagline** | "Независимая оценка имущества в Республике Башкортостан" |

---

## 2. Структура базы данных

### 2.1 Таблица: site_content

```sql
-- Создание таблицы для хранения контента секций
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,
  section_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS политики
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Публичное чтение для отображения на сайте
CREATE POLICY "Public can read visible content" ON public.site_content
  FOR SELECT USING (is_visible = true);

-- Админы могут всё
CREATE POLICY "Admins can manage content" ON public.site_content
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

**Начальные данные:**

```sql
INSERT INTO public.site_content (id, section_name, sort_order, content) VALUES

('hero', 'Главный экран', 1, '{
  "badge": "Независимая экспертная оценка",
  "heading": "Независимая оценка имущества",
  "heading_highlight_1": "в Дюртюлях",
  "heading_highlight_2": "Республике Башкортостан",
  "subheading": "Отчёты для суда, банка, нотариуса, сделок и страховых компаний. Законно, объективно, в согласованные сроки.",
  "cta_primary_text": "Рассчитать стоимость оценки",
  "cta_secondary_text": "Позвонить сейчас",
  "advantages": [
    "Отчёты соответствуют законодательству РФ",
    "Опыт работы и знание региона Башкортостана",
    "Работа с физическими и юридическими лицами",
    "Индивидуальный подход и понятные цены"
  ]
}'),

('services', 'Услуги', 2, '{
  "badge": "Наши услуги",
  "title": "Какие объекты оцениваем",
  "description": "Профессиональная оценка любых видов имущества для физических и юридических лиц",
  "items": [
    {
      "icon": "Building2",
      "title": "Оценка недвижимости",
      "description": "Квартиры, дома, комнаты, земельные участки, коммерческая недвижимость",
      "purposes": ["Банк и ипотека", "Нотариус", "Суд", "Купля-продажа"]
    },
    {
      "icon": "Car",
      "title": "Оценка транспорта",
      "description": "Легковые и грузовые автомобили, спецтехника, мотоциклы",
      "purposes": ["Страховая", "ДТП", "Залог", "Наследство"]
    },
    {
      "icon": "Wrench",
      "title": "Оценка оборудования",
      "description": "Производственное оборудование, станки, движимое имущество",
      "purposes": ["Залог", "Бухучёт", "Сделки", "Банк"]
    },
    {
      "icon": "Briefcase",
      "title": "Оценка бизнеса и долей",
      "description": "Оценка стоимости предприятий, долей участия в ООО",
      "purposes": ["Продажа", "Раздел", "Суд", "Инвестиции"]
    },
    {
      "icon": "AlertTriangle",
      "title": "Оценка ущерба",
      "description": "Залив, пожар, ДТП, порча имущества третьими лицами",
      "purposes": ["Суд", "Страховая", "Претензия", "Возмещение"]
    },
    {
      "icon": "Users",
      "title": "Оценка для наследства",
      "description": "Оценка для нотариуса при вступлении в наследство, дарении, разделе",
      "purposes": ["Нотариус", "Суд", "Дарение", "Раздел"]
    }
  ]
}'),

('purposes', 'Цели оценки', 3, '{
  "badge": "Цели оценки",
  "title": "Для каких целей нужна оценка",
  "description": "Независимый отчёт об оценке принимается всеми организациями",
  "items": [
    {"icon": "Landmark", "title": "Для банка и ипотеки", "description": "Отчёт для получения ипотечного кредита или залога недвижимости"},
    {"icon": "FileText", "title": "Для нотариуса", "description": "Наследство, дарение, вступление в наследство — официальный отчёт"},
    {"icon": "Scale", "title": "Для суда", "description": "Судебные споры, раздел имущества, споры по ущербу"},
    {"icon": "ShoppingBag", "title": "Для сделок", "description": "Купля-продажа, обмен, определение рыночной стоимости"},
    {"icon": "Shield", "title": "Для страховых выплат", "description": "Расчёт ущерба для страховой компании, возмещение убытков"}
  ]
}'),

('calculator', 'Калькулятор цен', 4, '{
  "badge": "Калькулятор стоимости",
  "title": "Рассчитайте примерную стоимость оценки",
  "description": "Выберите тип объекта и цель оценки — мы покажем ориентировочную стоимость. Точную цену назовём после уточнения деталей.",
  "disclaimer": "* Указанные цены являются ориентировочными. Окончательная стоимость определяется после консультации и зависит от сложности объекта, его местоположения и срочности выполнения работ.",
  "object_types": [
    {"value": "apartment", "label": "Квартира", "icon": "Building2", "price_min": 3500, "price_max": 6000},
    {"value": "house", "label": "Дом / Дача", "icon": "Home", "price_min": 5000, "price_max": 10000},
    {"value": "land", "label": "Земельный участок", "icon": "FileText", "price_min": 3000, "price_max": 7000},
    {"value": "commercial", "label": "Коммерческая недвижимость", "icon": "Building2", "price_min": 8000, "price_max": 25000},
    {"value": "car", "label": "Автомобиль", "icon": "Car", "price_min": 2500, "price_max": 5000},
    {"value": "equipment", "label": "Оборудование", "icon": "Factory", "price_min": 4000, "price_max": 15000},
    {"value": "business", "label": "Бизнес / Доля", "icon": "Briefcase", "price_min": 15000, "price_max": 50000},
    {"value": "damage", "label": "Оценка ущерба", "icon": "FileText", "price_min": 4000, "price_max": 12000}
  ],
  "purposes": [
    {"value": "bank", "label": "Для банка / ипотеки"},
    {"value": "notary", "label": "Для нотариуса (наследство, дарение)"},
    {"value": "court", "label": "Для суда", "multiplier": 1.2},
    {"value": "sale", "label": "Для купли-продажи"},
    {"value": "insurance", "label": "Для страховой"},
    {"value": "other", "label": "Другое"}
  ]
}'),

('process', 'Процесс работы', 5, '{
  "badge": "Процесс работы",
  "title": "Как проходит работа",
  "description": "Прозрачный процесс от заявки до получения готового отчёта",
  "steps": [
    {"icon": "PhoneCall", "number": "01", "title": "Звонок или заявка", "description": "Свяжитесь с нами через сайт или по телефону. Проведём краткую консультацию."},
    {"icon": "FileSearch", "number": "02", "title": "Сбор документов", "description": "Соберём информацию и документы, согласуем стоимость и сроки работы."},
    {"icon": "MapPin", "number": "03", "title": "Осмотр объекта", "description": "При необходимости выезжаем в Дюртюли и по всей Республике Башкортостан."},
    {"icon": "Calculator", "number": "04", "title": "Расчёты и анализ", "description": "Проводим расчёты и готовим отчёт в соответствии с требованиями."},
    {"icon": "FileCheck", "number": "05", "title": "Передача отчёта", "description": "Передаём отчёт в бумажном и/или электронном виде с пояснениями."}
  ]
}'),

('advantages', 'Преимущества', 6, '{
  "badge": "Почему мы",
  "title": "Наши преимущества",
  "description": "Профессиональный подход к каждому клиенту",
  "items": [
    {"icon": "UserCheck", "title": "Индивидуальная работа", "description": "Работаем с каждым клиентом лично, без «конвейерного» подхода. Внимание к деталям вашего дела."},
    {"icon": "Target", "title": "Ориентация на цели", "description": "Понимаем, для чего вам нужна оценка — банк, суд, нотариат — и готовим отчёт под конкретную задачу."},
    {"icon": "MapPinned", "title": "Знание местного рынка", "description": "Глубокое понимание рынка недвижимости и имущества Дюртюлей и всей Республики Башкортостан."},
    {"icon": "Smartphone", "title": "Удалённое оформление", "description": "Возможность оформить часть документов дистанционно — по телефону, мессенджерам, электронной почте."}
  ]
}'),

('cases', 'Примеры работ', 7, '{
  "badge": "Примеры работ",
  "title": "Примеры задач",
  "description": "Типовые сценарии работы с клиентами",
  "items": [
    {"title": "Оценка квартиры для ипотеки", "situation": "Клиенту требовалась оценка двухкомнатной квартиры в Дюртюлях для получения ипотечного кредита в банке.", "action": "Провели осмотр квартиры, собрали документы, подготовили отчёт в соответствии с требованиями банка.", "result": "Отчёт принят банком без замечаний, клиент получил одобрение ипотеки в течение недели."},
    {"title": "Оценка дома для нотариуса", "situation": "Наследники обратились для оценки жилого дома и земельного участка при вступлении в наследство.", "action": "Выехали на осмотр объекта, изучили правоустанавливающие документы, определили рыночную стоимость.", "result": "Нотариус принял отчёт, наследники успешно оформили право собственности."},
    {"title": "Оценка автомобиля после ДТП", "situation": "После ДТП страховая занизила выплату. Владелец обратился для независимой оценки ущерба.", "action": "Провели осмотр повреждённого автомобиля, рассчитали реальный размер ущерба по рыночным ценам.", "result": "С отчётом клиент обратился в суд и получил полное возмещение ущерба."},
    {"title": "Оценка коммерческого помещения", "situation": "Предприниматель готовил магазин к залогу для получения кредита на развитие бизнеса.", "action": "Оценили коммерческое помещение с учётом местоположения, арендного потенциала и состояния.", "result": "Банк одобрил кредит под залог помещения на основании нашего отчёта."}
  ]
}'),

('faq', 'Вопросы и ответы', 8, '{
  "badge": "Вопросы и ответы",
  "title": "Ответы на частые вопросы",
  "description": "Не нашли ответ? Свяжитесь с нами — проконсультируем бесплатно",
  "items": [
    {"question": "Сколько стоит оценка квартиры/дома/авто? От чего зависит цена?", "answer": "Стоимость оценки зависит от типа объекта, его местоположения, площади и цели оценки. Оценка квартиры начинается от 3000 рублей, дома — от 5000 рублей, автомобиля — от 2500 рублей. Точную стоимость назовём после уточнения деталей вашей задачи."},
    {"question": "Сколько времени занимает подготовка отчёта?", "answer": "Стандартный срок подготовки отчёта — от 1 до 5 рабочих дней в зависимости от сложности объекта и загруженности. При срочной необходимости возможна ускоренная подготовка за дополнительную плату."},
    {"question": "Принимают ли отчёт банки, суды, нотариусы?", "answer": "Да, все наши отчёты соответствуют требованиям Федерального закона №135-ФЗ «Об оценочной деятельности» и Федеральных стандартов оценки. Отчёты принимаются банками, судами, нотариусами и другими организациями."},
    {"question": "Какие документы нужны для оценки квартиры/авто/земли?", "answer": "Для оценки недвижимости: свидетельство о праве собственности или выписка из ЕГРН, технический паспорт. Для оценки авто: ПТС, СТС. Для земельного участка: документы на землю и кадастровый паспорт. Полный перечень уточняем индивидуально."},
    {"question": "Можно ли заказать оценку, если нахожусь в другом городе?", "answer": "Да, возможно. Часть документов можно оформить дистанционно через мессенджеры и электронную почту. При необходимости осмотра объекта договариваемся о времени выезда или просим прислать фото/видео материалы."}
  ]
}'),

('contacts', 'Контакты', 9, '{
  "badge": "Контакты",
  "title": "Оставьте заявку",
  "description": "Свяжемся с вами, уточним задачу и назовём стоимость оценки",
  "form_title": "Форма заявки",
  "phone": "+7 (927) 080-95-67",
  "phone_link": "+79270809567",
  "address": "РБ, г. Дюртюли, ул. Ленина, д. 8, оф. 202",
  "whatsapp_link": "https://wa.me/79270809567",
  "telegram_link": "https://t.me/+79270809567",
  "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2205.5!2d55.4869!3d55.4942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDI5JzM5LjEiTiA1NcKwMjknMTIuOCJF!5e0!3m2!1sru!2sru!4v1609459200000!5m2!1sru!2sru"
}');
```

### 2.2 Таблица: navigation_items

```sql
CREATE TABLE public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL CHECK (location IN ('header', 'footer', 'mobile')),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  icon TEXT,
  open_in_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible navigation" ON public.navigation_items
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage navigation" ON public.navigation_items
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
```

**Начальные данные:**

```sql
INSERT INTO public.navigation_items (location, label, href, sort_order) VALUES
('header', 'Услуги', '#services', 1),
('header', 'Цели оценки', '#purposes', 2),
('header', 'Как работаем', '#process', 3),
('header', 'Примеры', '#cases', 4),
('header', 'Вопросы', '#faq', 5),
('header', 'Контакты', '#contacts', 6);
```

### 2.3 Таблица: site_settings

```sql
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings" ON public.site_settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
```

**Начальные данные:**

```sql
INSERT INTO public.site_settings (key, value, description) VALUES
('company', '{
  "name": "ИП Кабиров Альмир Робертович",
  "tagline": "Независимая оценка имущества в Республике Башкортостан",
  "logo_url": "/assets/logo.png"
}', 'Основная информация о компании'),

('contacts', '{
  "phone": "+7 (927) 080-95-67",
  "phone_link": "+79270809567",
  "address": "РБ, г. Дюртюли, ул. Ленина, д. 8, оф. 202",
  "email": ""
}', 'Контактные данные'),

('social', '{
  "whatsapp": "https://wa.me/79270809567",
  "telegram": "https://t.me/+79270809567",
  "vk": "",
  "instagram": ""
}', 'Социальные сети и мессенджеры'),

('integrations', '{
  "telegram_bot_token": "8223684027:AAGkaI_YewHQUeoSaZ2EqfLVOnmvKhRSIv8",
  "telegram_chat_id": "8271729626"
}', 'Интеграции (Telegram бот и т.д.)'),

('seo', '{
  "title": "Независимая оценка имущества в Дюртюлях | Центр оценки и права",
  "description": "Профессиональная оценка недвижимости, транспорта, бизнеса. Отчёты для банка, суда, нотариуса.",
  "keywords": "оценка недвижимости, оценка авто, Дюртюли, Башкортостан"
}', 'SEO настройки'),

('evaluation_types', '{
  "items": [
    {"value": "apartment", "label": "Оценка квартиры"},
    {"value": "house", "label": "Оценка дома"},
    {"value": "land", "label": "Оценка земельного участка"},
    {"value": "commercial", "label": "Оценка коммерческой недвижимости"},
    {"value": "car", "label": "Оценка автомобиля"},
    {"value": "equipment", "label": "Оценка оборудования"},
    {"value": "business", "label": "Оценка бизнеса"},
    {"value": "damage", "label": "Оценка ущерба"},
    {"value": "inheritance", "label": "Оценка для наследства"},
    {"value": "other", "label": "Другое"}
  ]
}', 'Типы оценки для форм');
```

### 2.4 Таблица: user_roles (безопасность)

```sql
-- Enum для ролей
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Таблица ролей
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Функция проверки роли (SECURITY DEFINER - избегает рекурсии RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Политики для user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
```

### 2.5 Таблица: form_submissions (замена localStorage)

```sql
CREATE TABLE public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  evaluation_type TEXT,
  evaluation_type_label TEXT,
  comment TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Публичная вставка (для формы)
CREATE POLICY "Anyone can submit form" ON public.form_submissions
  FOR INSERT WITH CHECK (true);

-- Только админы могут читать и управлять
CREATE POLICY "Admins can manage submissions" ON public.form_submissions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
```

### 2.6 Storage bucket для изображений

```sql
-- Создание bucket для изображений
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- RLS политики для storage
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'images' AND 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'images' AND 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'images' AND 
    public.has_role(auth.uid(), 'admin')
  );
```

---

## 3. Редакторы для каждой секции

### 3.1 HeroEditor (id: 'hero')
**Поля формы:**
- `badge` (text) - Бейдж над заголовком
- `heading` (text) - Основной заголовок
- `heading_highlight_1` (text) - Выделенный текст 1
- `heading_highlight_2` (text) - Выделенный текст 2
- `subheading` (textarea) - Подзаголовок
- `cta_primary_text` (text) - Текст основной кнопки
- `cta_secondary_text` (text) - Текст дополнительной кнопки
- `advantages` (array of strings) - Список преимуществ (4 элемента)

### 3.2 ServicesEditor (id: 'services')
**Поля формы:**
- `badge` (text)
- `title` (text)
- `description` (textarea)
- `items` (array of objects):
  - `icon` (select) - выбор из списка Lucide иконок
  - `title` (text)
  - `description` (textarea)
  - `purposes` (tags input) - массив тегов

### 3.3 PurposesEditor (id: 'purposes')
**Поля формы:**
- `badge`, `title`, `description` (стандартные)
- `items` (array):
  - `icon` (select)
  - `title` (text)
  - `description` (textarea)

### 3.4 CalculatorEditor (id: 'calculator')
**Поля формы:**
- `badge`, `title`, `description`, `disclaimer` (стандартные)
- `object_types` (array):
  - `value` (text)
  - `label` (text)
  - `icon` (select)
  - `price_min` (number)
  - `price_max` (number)
- `purposes` (array):
  - `value` (text)
  - `label` (text)
  - `multiplier` (number, optional)

### 3.5 ProcessEditor (id: 'process')
**Поля формы:**
- `badge`, `title`, `description` (стандартные)
- `steps` (array, сортируемый):
  - `icon` (select)
  - `number` (text)
  - `title` (text)
  - `description` (textarea)

### 3.6 AdvantagesEditor (id: 'advantages')
**Поля формы:**
- `badge`, `title`, `description` (стандартные)
- `items` (array):
  - `icon` (select)
  - `title` (text)
  - `description` (textarea)

### 3.7 CasesEditor (id: 'cases')
**Поля формы:**
- `badge`, `title`, `description` (стандартные)
- `items` (array):
  - `title` (text)
  - `situation` (textarea)
  - `action` (textarea)
  - `result` (textarea)

### 3.8 FAQEditor (id: 'faq')
**Поля формы:**
- `badge`, `title`, `description` (стандартные)
- `items` (array, сортируемый):
  - `question` (text)
  - `answer` (textarea)

### 3.9 ContactsEditor (id: 'contacts')
**Поля формы:**
- `badge`, `title`, `description`, `form_title` (стандартные)
- `phone` (text)
- `phone_link` (text)
- `address` (textarea)
- `whatsapp_link` (text)
- `telegram_link` (text)
- `map_embed_url` (text)

---

## 4. Компоненты для создания

### 4.1 Базовые компоненты
```text
src/
├── components/
│   └── admin/
│       ├── ProtectedRoute.tsx       # Защита маршрутов админки
│       ├── AdminLayout.tsx          # Общий layout админки
│       ├── AdminSidebar.tsx         # Боковое меню
│       ├── AdminHeader.tsx          # Шапка админки
│       └── fields/
│           ├── TextField.tsx        # Текстовое поле
│           ├── TextareaField.tsx    # Многострочное поле
│           ├── ImageUploader.tsx    # Загрузка изображений
│           ├── IconSelect.tsx       # Выбор иконки
│           ├── ArrayField.tsx       # Редактор массивов
│           ├── TagsInput.tsx        # Ввод тегов
│           └── SortableList.tsx     # Сортируемый список
```

### 4.2 Редакторы секций
```text
src/
├── components/
│   └── admin/
│       └── editors/
│           ├── HeroEditor.tsx
│           ├── ServicesEditor.tsx
│           ├── PurposesEditor.tsx
│           ├── CalculatorEditor.tsx
│           ├── ProcessEditor.tsx
│           ├── AdvantagesEditor.tsx
│           ├── CasesEditor.tsx
│           ├── FAQEditor.tsx
│           ├── ContactsEditor.tsx
│           └── index.ts             # Экспорт всех редакторов
```

### 4.3 Страницы админки
```text
src/
├── pages/
│   └── admin/
│       ├── Login.tsx                # Страница входа
│       ├── Dashboard.tsx            # Обзорная панель
│       ├── Sections.tsx             # Список секций
│       ├── SectionEdit.tsx          # Редактирование секции
│       ├── Navigation.tsx           # Редактор меню
│       ├── Submissions.tsx          # Заявки (замена текущей Admin.tsx)
│       ├── Media.tsx                # Галерея изображений
│       └── Settings.tsx             # Настройки сайта
```

---

## 5. Хуки и утилиты

### 5.1 Хуки
```typescript
// src/hooks/useContent.ts
// Загрузка контента секции с fallback на hardcoded значения
const useContent = <T>(sectionId: string, fallback: T) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['content', sectionId],
    queryFn: () => supabase
      .from('site_content')
      .select('content, is_visible')
      .eq('id', sectionId)
      .maybeSingle()
  });
  
  return {
    content: data?.content as T || fallback,
    isVisible: data?.is_visible ?? true,
    isLoading,
    error,
    refetch
  };
};

// src/hooks/useSettings.ts
// Загрузка настроек сайта
const useSettings = <T>(key: string, fallback: T) => {...};

// src/hooks/useNavigation.ts
// Загрузка навигации
const useNavigation = (location: 'header' | 'footer') => {...};

// src/hooks/useAuth.ts
// Авторизация и проверка роли
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // ...
};

// src/hooks/useImageUpload.ts
// Загрузка изображений в Supabase Storage
const useImageUpload = (bucket: string = 'images') => {
  const upload = async (file: File) => {...};
  const remove = async (path: string) => {...};
  return { upload, remove, isUploading };
};

// src/hooks/useContentMutation.ts
// Сохранение контента секции
const useContentMutation = (sectionId: string) => {...};
```

### 5.2 Типы TypeScript
```typescript
// src/types/content.ts
interface SectionContent {
  id: string;
  section_name: string;
  content: Record<string, any>;
  is_visible: boolean;
  sort_order: number;
}

interface HeroContent {
  badge: string;
  heading: string;
  heading_highlight_1: string;
  heading_highlight_2: string;
  subheading: string;
  cta_primary_text: string;
  cta_secondary_text: string;
  advantages: string[];
}

// ... интерфейсы для каждой секции
```

---

## 6. Страницы админки

| Путь | Компонент | Описание |
|------|-----------|----------|
| `/admin` | Login.tsx | Страница входа (email/password) |
| `/admin/dashboard` | Dashboard.tsx | Статистика: заявки, секции |
| `/admin/sections` | Sections.tsx | Список всех секций с переключателем видимости |
| `/admin/sections/:id` | SectionEdit.tsx | Универсальный редактор секции |
| `/admin/navigation` | Navigation.tsx | CRUD для меню |
| `/admin/submissions` | Submissions.tsx | Заявки с фильтрами и статусами |
| `/admin/media` | Media.tsx | Галерея с drag-and-drop |
| `/admin/settings` | Settings.tsx | Настройки: компания, контакты, SEO, интеграции |

---

## 7. Миграция компонентов сайта

### 7.1 Схема миграции
```tsx
// БЫЛО (HeroSection.tsx):
const HeroSection = () => {
  const advantages = [
    "Отчёты соответствуют законодательству РФ",
    // ...
  ];
  return <h1>Независимая оценка имущества...</h1>;
};

// СТАНЕТ:
import { useContent } from "@/hooks/useContent";
import { HeroContent, HERO_FALLBACK } from "@/types/content";

const HeroSection = () => {
  const { content, isVisible, isLoading } = useContent<HeroContent>('hero', HERO_FALLBACK);
  
  if (!isVisible) return null;
  if (isLoading) return <HeroSkeleton />;
  
  return (
    <section>
      <div className="badge">{content.badge}</div>
      <h1>
        {content.heading}{" "}
        <span className="text-gradient">{content.heading_highlight_1}</span>
        ...
      </h1>
      {content.advantages.map((adv, i) => (
        <div key={i}>{adv}</div>
      ))}
    </section>
  );
};
```

### 7.2 Файлы для обновления
| Файл | Изменения |
|------|-----------|
| `HeroSection.tsx` | + useContent('hero'), + fallback, + isVisible |
| `ServicesSection.tsx` | + useContent('services'), динамические иконки |
| `PurposesSection.tsx` | + useContent('purposes') |
| `PriceCalculator.tsx` | + useContent('calculator') |
| `ProcessSection.tsx` | + useContent('process') |
| `AdvantagesSection.tsx` | + useContent('advantages') |
| `CasesSection.tsx` | + useContent('cases') |
| `FAQSection.tsx` | + useContent('faq') |
| `ContactSection.tsx` | + useContent('contacts'), + useSettings |
| `Header.tsx` | + useNavigation('header'), + useSettings('contacts') |
| `Footer.tsx` | + useSettings('company') |
| `RequestFormDialog.tsx` | + useSettings для Telegram интеграции |

---

## 8. Порядок реализации

### Этап 1: Подключение Supabase (1-2 часа)
1. Подключить Lovable Cloud или внешний Supabase
2. Выполнить SQL миграции для всех таблиц
3. Создать Storage bucket 'images'
4. Создать первого админа вручную через SQL

### Этап 2: Базовые хуки и типы (2-3 часа)
1. Создать все TypeScript интерфейсы
2. Создать useContent, useSettings, useNavigation
3. Создать useAuth с проверкой роли
4. Создать useImageUpload

### Этап 3: Авторизация админки (2-3 часа)
1. Создать страницу /admin/login
2. Создать ProtectedRoute
3. Заменить sessionStorage на Supabase Auth
4. Удалить hardcoded пароль admin123

### Этап 4: Layout админки (2-3 часа)
1. Создать AdminLayout с sidebar
2. Создать AdminSidebar с навигацией
3. Создать AdminHeader
4. Настроить роутинг

### Этап 5: Dashboard и Submissions (2-3 часа)
1. Создать Dashboard со статистикой
2. Мигрировать текущую Admin.tsx в Submissions
3. Добавить статусы заявок и фильтры

### Этап 6: Редакторы секций (4-6 часов)
1. Создать базовые компоненты полей (TextField, ArrayField...)
2. Создать SectionEdit.tsx (универсальный роутер)
3. Создать редакторы по одному:
   - HeroEditor (самый простой)
   - FAQEditor (массив простых объектов)
   - ServicesEditor (сложные объекты с тегами)
   - Остальные по аналогии

### Этап 7: Миграция компонентов сайта (3-4 часа)
1. Начать с HeroSection (простой)
2. Добавить fallback данные
3. Мигрировать остальные секции
4. Тестировать каждую секцию

### Этап 8: Дополнительные страницы (2-3 часа)
1. Navigation editor
2. Settings page
3. Media gallery

### Этап 9: Финальное тестирование (1-2 часа)
1. Проверить все редакторы
2. Проверить отображение на сайте
3. Проверить RLS политики
4. Проверить загрузку изображений

---

## 9. Потенциальные проблемы и решения

| Проблема | Решение |
|----------|---------|
| **Иконки как строки** | Создать маппинг строка → компонент Lucide |
| **Изображения** | Мигрировать logo.png в Storage, обновить ссылки |
| **Telegram токен в коде** | Перенести в site_settings и загружать через useSettings |
| **localStorage заявок** | Полностью заменить на form_submissions таблицу |
| **Кеширование** | Настроить React Query staleTime для оптимизации |
| **Типизация JSONB** | Использовать Zod для валидации на клиенте |

---

## 10. Чеклист готовности

**База данных:**
- [ ] site_content таблица создана
- [ ] navigation_items таблица создана
- [ ] site_settings таблица создана
- [ ] user_roles таблица создана
- [ ] form_submissions таблица создана
- [ ] Storage bucket 'images' создан
- [ ] RLS политики настроены
- [ ] Начальные данные загружены

**Код:**
- [ ] TypeScript интерфейсы созданы
- [ ] Все хуки реализованы
- [ ] Авторизация через Supabase работает
- [ ] ProtectedRoute защищает админку
- [ ] Все редакторы секций созданы
- [ ] Все компоненты сайта мигрированы
- [ ] Fallback данные работают при ошибках

**Тестирование:**
- [ ] Админ может войти
- [ ] Редактирование секций сохраняется
- [ ] Изменения отображаются на сайте
- [ ] Загрузка изображений работает
- [ ] Заявки сохраняются в БД
- [ ] Неавторизованные пользователи не видят админку

---

## Техническая информация

### Используемые технологии
- **Frontend**: React 18, TypeScript, Tailwind CSS, React Query
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI библиотека**: Radix UI (уже установлена)
- **Иконки**: Lucide React (уже используется)
- **Формы**: React Hook Form + Zod (уже установлены)

### Примерное время реализации
- **Минимум**: 15-20 часов
- **С тестированием**: 20-25 часов

### Зависимости для установки
```bash
# Если используется внешний Supabase (не Lovable Cloud)
npm install @supabase/supabase-js
```
