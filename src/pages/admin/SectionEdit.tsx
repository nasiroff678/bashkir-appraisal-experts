import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { useSections, useUpdateContent } from "@/hooks/useContent";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SectionEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: sections, isLoading } = useSections();
  const updateContent = useUpdateContent();
  
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);

  const section = sections?.find(s => s.id === id);

  useEffect(() => {
    if (section?.content) {
      setContent(section.content as Record<string, unknown>);
    }
  }, [section]);

  const handleSave = async () => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      await updateContent.mutateAsync({ sectionId: id, content });
      toast({ title: "Изменения сохранены" });
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (key: string, value: unknown) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const updateArrayItem = (key: string, index: number, field: string, value: unknown) => {
    setContent(prev => {
      const arr = [...(prev[key] as unknown[] || [])];
      arr[index] = { ...(arr[index] as Record<string, unknown>), [field]: value };
      return { ...prev, [key]: arr };
    });
  };

  const addArrayItem = (key: string, template: Record<string, unknown>) => {
    setContent(prev => {
      const arr = [...(prev[key] as unknown[] || []), template];
      return { ...prev, [key]: arr };
    });
  };

  const removeArrayItem = (key: string, index: number) => {
    setContent(prev => {
      const arr = [...(prev[key] as unknown[] || [])];
      arr.splice(index, 1);
      return { ...prev, [key]: arr };
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </Card>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-foreground">Секция не найдена</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/admin/sections")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к секциям
        </Button>
      </div>
    );
  }

  // Render different editors based on content structure
  const renderEditor = () => {
    const keys = Object.keys(content);
    
    return (
      <div className="space-y-6">
        {keys.map(key => {
          const value = content[key];
          
          // String fields
          if (typeof value === 'string') {
            const isLongText = value.length > 100 || key.includes('description') || key.includes('subheading') || key.includes('answer');
            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="capitalize">
                  {key.replace(/_/g, ' ')}
                </Label>
                {isLongText ? (
                  <Textarea
                    id={key}
                    value={value}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={key}
                    value={value}
                    onChange={(e) => updateField(key, e.target.value)}
                  />
                )}
              </div>
            );
          }
          
          // Array of strings (e.g., advantages)
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
            return (
              <div key={key} className="space-y-3">
                <Label className="capitalize">{key.replace(/_/g, ' ')}</Label>
                {(value as string[]).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                    <Input
                      value={item}
                      onChange={(e) => {
                        const newArr = [...value];
                        newArr[index] = e.target.value;
                        updateField(key, newArr);
                      }}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newArr = [...value];
                        newArr.splice(index, 1);
                        updateField(key, newArr);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateField(key, [...value, ""])}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>
            );
          }
          
          // Array of objects (e.g., items, steps, faqs)
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            const firstItem = value[0] as Record<string, unknown>;
            const itemKeys = Object.keys(firstItem);
            
            return (
              <div key={key} className="space-y-4">
                <Label className="capitalize text-lg font-semibold">{key.replace(/_/g, ' ')}</Label>
                {(value as Record<string, unknown>[]).map((item, index) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Элемент {index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem(key, index)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    {itemKeys.map(itemKey => {
                      const itemValue = item[itemKey];
                      
                      // Skip arrays within objects for now (e.g., purposes)
                      if (Array.isArray(itemValue)) {
                        return (
                          <div key={itemKey} className="space-y-2">
                            <Label className="text-sm capitalize">{itemKey}</Label>
                            <Input
                              value={(itemValue as string[]).join(', ')}
                              onChange={(e) => updateArrayItem(key, index, itemKey, e.target.value.split(', '))}
                              placeholder="Через запятую"
                            />
                          </div>
                        );
                      }
                      
                      const isLong = typeof itemValue === 'string' && (
                        itemValue.length > 80 || 
                        itemKey.includes('description') || 
                        itemKey.includes('answer') ||
                        itemKey.includes('situation') ||
                        itemKey.includes('action') ||
                        itemKey.includes('result')
                      );
                      
                      return (
                        <div key={itemKey} className="space-y-1">
                          <Label className="text-sm capitalize">{itemKey.replace(/_/g, ' ')}</Label>
                          {isLong ? (
                            <Textarea
                              value={String(itemValue || '')}
                              onChange={(e) => updateArrayItem(key, index, itemKey, e.target.value)}
                              rows={2}
                            />
                          ) : (
                            <Input
                              value={String(itemValue || '')}
                              onChange={(e) => {
                                // Handle numbers
                                const val = itemKey.includes('price') || itemKey.includes('multiplier')
                                  ? Number(e.target.value) || e.target.value
                                  : e.target.value;
                                updateArrayItem(key, index, itemKey, val);
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </Card>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem(key, { ...firstItem })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить элемент
                </Button>
              </div>
            );
          }
          
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/sections")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              {section.section_name}
            </h1>
            <p className="text-muted-foreground">ID: {section.id}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      {/* Editor */}
      <Card className="p-6">
        {renderEditor()}
      </Card>
    </div>
  );
};

export default SectionEdit;
