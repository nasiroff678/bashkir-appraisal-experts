-- Этап 1: Создание enum для ролей пользователей
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Этап 2: Таблица ролей пользователей
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Функция проверки роли (SECURITY DEFINER для избежания рекурсии RLS)
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

-- Этап 3: Таблица для хранения контента секций
CREATE TABLE public.site_content (
  id TEXT PRIMARY KEY,
  section_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Этап 4: Таблица навигации
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

-- Этап 5: Таблица настроек сайта
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

-- Этап 6: Таблица заявок (замена localStorage)
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

-- Этап 7: Storage bucket для изображений
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