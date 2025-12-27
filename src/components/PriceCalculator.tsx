import { useState } from "react";
import { Calculator, Building2, Car, Factory, Briefcase, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ObjectType = "apartment" | "house" | "land" | "commercial" | "car" | "equipment" | "business" | "damage";

interface PriceRange {
  min: number;
  max: number;
  label: string;
}

const objectTypes: { value: ObjectType; label: string; icon: React.ReactNode }[] = [
  { value: "apartment", label: "Квартира", icon: <Building2 className="w-5 h-5" /> },
  { value: "house", label: "Дом / Дача", icon: <Home className="w-5 h-5" /> },
  { value: "land", label: "Земельный участок", icon: <FileText className="w-5 h-5" /> },
  { value: "commercial", label: "Коммерческая недвижимость", icon: <Building2 className="w-5 h-5" /> },
  { value: "car", label: "Автомобиль", icon: <Car className="w-5 h-5" /> },
  { value: "equipment", label: "Оборудование", icon: <Factory className="w-5 h-5" /> },
  { value: "business", label: "Бизнес / Доля", icon: <Briefcase className="w-5 h-5" /> },
  { value: "damage", label: "Оценка ущерба", icon: <FileText className="w-5 h-5" /> },
];

const purposes = [
  { value: "bank", label: "Для банка / ипотеки" },
  { value: "notary", label: "Для нотариуса (наследство, дарение)" },
  { value: "court", label: "Для суда" },
  { value: "sale", label: "Для купли-продажи" },
  { value: "insurance", label: "Для страховой" },
  { value: "other", label: "Другое" },
];

const getPriceRange = (objectType: ObjectType, purpose: string): PriceRange => {
  const basePrices: Record<ObjectType, { min: number; max: number }> = {
    apartment: { min: 3500, max: 6000 },
    house: { min: 5000, max: 10000 },
    land: { min: 3000, max: 7000 },
    commercial: { min: 8000, max: 25000 },
    car: { min: 2500, max: 5000 },
    equipment: { min: 4000, max: 15000 },
    business: { min: 15000, max: 50000 },
    damage: { min: 4000, max: 12000 },
  };

  const base = basePrices[objectType];
  
  // Корректировка для суда (обычно дороже из-за требований)
  const courtMultiplier = purpose === "court" ? 1.2 : 1;
  
  return {
    min: Math.round(base.min * courtMultiplier),
    max: Math.round(base.max * courtMultiplier),
    label: getObjectLabel(objectType),
  };
};

const getObjectLabel = (type: ObjectType): string => {
  const labels: Record<ObjectType, string> = {
    apartment: "квартиры",
    house: "дома",
    land: "земельного участка",
    commercial: "коммерческой недвижимости",
    car: "автомобиля",
    equipment: "оборудования",
    business: "бизнеса",
    damage: "ущерба",
  };
  return labels[type];
};

const PriceCalculator = () => {
  const [objectType, setObjectType] = useState<ObjectType | "">("");
  const [purpose, setPurpose] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = () => {
    if (objectType && purpose) {
      setShowResult(true);
    }
  };

  const priceRange = objectType && purpose ? getPriceRange(objectType as ObjectType, purpose) : null;

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Здравствуйте! Интересует оценка ${priceRange?.label}. Цель: ${purposes.find(p => p.value === purpose)?.label}. Хотел бы уточнить стоимость.`
    );
    window.open(`https://wa.me/79270809567?text=${text}`, "_blank");
  };

  return (
    <section id="calculator" className="py-20 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calculator className="w-4 h-4" />
            Калькулятор стоимости
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Рассчитайте примерную стоимость оценки
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите тип объекта и цель оценки — мы покажем ориентировочную стоимость. 
            Точную цену назовём после уточнения деталей.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-elegant p-6 md:p-10 border border-border">
          {/* Шаг 1: Выбор типа объекта */}
          <div className="mb-8">
            <Label className="text-lg font-semibold mb-4 block text-foreground">
              1. Что нужно оценить?
            </Label>
            <RadioGroup
              value={objectType}
              onValueChange={(value) => {
                setObjectType(value as ObjectType);
                setShowResult(false);
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {objectTypes.map((type) => (
                <div key={type.value}>
                  <RadioGroupItem
                    value={type.value}
                    id={type.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={type.value}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border bg-background cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <span className="text-primary">{type.icon}</span>
                    <span className="text-sm font-medium text-center text-foreground">{type.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Шаг 2: Выбор цели */}
          <div className="mb-8">
            <Label className="text-lg font-semibold mb-4 block text-foreground">
              2. Для какой цели?
            </Label>
            <Select
              value={purpose}
              onValueChange={(value) => {
                setPurpose(value);
                setShowResult(false);
              }}
            >
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Выберите цель оценки" />
              </SelectTrigger>
              <SelectContent>
                {purposes.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-base">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Кнопка расчёта */}
          <Button
            onClick={handleCalculate}
            disabled={!objectType || !purpose}
            className="w-full h-14 text-lg font-semibold"
            size="lg"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Рассчитать стоимость
          </Button>

          {/* Результат */}
          {showResult && priceRange && (
            <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20 animate-fade-in">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  Примерная стоимость оценки {priceRange.label}:
                </p>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {priceRange.min.toLocaleString("ru-RU")} — {priceRange.max.toLocaleString("ru-RU")} ₽
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Точная стоимость зависит от характеристик объекта, срочности и объёма работ
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={handleWhatsApp} variant="whatsapp" size="lg">
                    Уточнить в WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Оставить заявку
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
          * Указанные цены являются ориентировочными. Окончательная стоимость определяется после 
          консультации и зависит от сложности объекта, его местоположения и срочности выполнения работ.
        </p>
      </div>
    </section>
  );
};

export default PriceCalculator;
