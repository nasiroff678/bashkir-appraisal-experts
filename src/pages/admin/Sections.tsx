import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useSections, useToggleSectionVisibility } from "@/hooks/useContent";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Sections = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: sections, isLoading, refetch } = useSections();
  const toggleVisibility = useToggleSectionVisibility();

  const handleToggleVisibility = async (sectionId: string, isVisible: boolean) => {
    try {
      await toggleVisibility.mutateAsync({ sectionId, isVisible });
      toast({ 
        title: isVisible ? "Секция показана" : "Секция скрыта" 
      });
    } catch {
      toast({ 
        title: "Ошибка обновления", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Секции сайта</h1>
          <p className="text-muted-foreground">
            Управляйте контентом и видимостью секций
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Обновить
        </Button>
      </div>

      {/* Sections List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-10" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sections?.map((section) => (
            <Card key={section.id} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {section.sort_order}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{section.section_name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {section.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Visibility Toggle */}
                  <div className="flex items-center gap-2">
                    {section.is_visible ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <Switch
                      checked={section.is_visible}
                      onCheckedChange={(checked) => handleToggleVisibility(section.id, checked)}
                    />
                  </div>
                  
                  {/* Edit Button */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/admin/sections/${section.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sections;
