import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Trash2, 
  Save, 
  GripVertical,
  RefreshCw
} from "lucide-react";
import { 
  useAllNavigation, 
  useNavigationMutations 
} from "@/hooks/useNavigation";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Navigation = () => {
  const { toast } = useToast();
  const { data: items, isLoading, refetch } = useAllNavigation();
  const { createItem, updateItem, deleteItem } = useNavigationMutations();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    label: '',
    href: '',
    location: 'header' as 'header' | 'footer' | 'mobile',
    is_visible: true,
    sort_order: 0,
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (item: typeof items[0]) => {
    setEditingId(item.id);
    setEditForm({
      label: item.label,
      href: item.href,
      location: item.location as 'header' | 'footer' | 'mobile',
      is_visible: item.is_visible,
      sort_order: item.sort_order,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    try {
      await updateItem.mutateAsync({
        id: editingId,
        ...editForm,
      });
      toast({ title: "Сохранено" });
      setEditingId(null);
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleAdd = async () => {
    try {
      const maxOrder = items?.reduce((max, item) => 
        item.location === editForm.location ? Math.max(max, item.sort_order) : max, 0
      ) || 0;
      
      await createItem.mutateAsync({
        ...editForm,
        sort_order: maxOrder + 1,
        open_in_new_tab: false,
      });
      toast({ title: "Пункт добавлен" });
      setIsAdding(false);
      setEditForm({ label: '', href: '', location: 'header', is_visible: true, sort_order: 0 });
    } catch {
      toast({ title: "Ошибка добавления", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast({ title: "Пункт удалён" });
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const headerItems = items?.filter(i => i.location === 'header') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Навигация</h1>
          <p className="text-muted-foreground">
            Управление пунктами меню
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
          <Button size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Добавить
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <Card className="p-4 border-primary">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                value={editForm.label}
                onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                placeholder="Услуги"
              />
            </div>
            <div className="space-y-2">
              <Label>Ссылка</Label>
              <Input
                value={editForm.href}
                onChange={(e) => setEditForm(prev => ({ ...prev, href: e.target.value }))}
                placeholder="#services"
              />
            </div>
            <div className="space-y-2">
              <Label>Расположение</Label>
              <Select 
                value={editForm.location} 
                onValueChange={(v: 'header' | 'footer' | 'mobile') => setEditForm(prev => ({ ...prev, location: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Шапка</SelectItem>
                  <SelectItem value="footer">Подвал</SelectItem>
                  <SelectItem value="mobile">Мобильное меню</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
              <Button variant="ghost" onClick={() => setIsAdding(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Items */}
      <div className="space-y-4">
        <h2 className="font-semibold text-foreground">Меню в шапке</h2>
        
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </Card>
            ))}
          </div>
        ) : headerItems.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Пунктов меню нет</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {headerItems.map((item) => (
              <Card key={item.id} className="p-4">
                {editingId === item.id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">Название</Label>
                      <Input
                        value={editForm.label}
                        onChange={(e) => setEditForm(prev => ({ ...prev, label: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Ссылка</Label>
                      <Input
                        value={editForm.href}
                        onChange={(e) => setEditForm(prev => ({ ...prev, href: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Порядок</Label>
                      <Input
                        type="number"
                        value={editForm.sort_order}
                        onChange={(e) => setEditForm(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editForm.is_visible}
                        onCheckedChange={(v) => setEditForm(prev => ({ ...prev, is_visible: v }))}
                      />
                      <Label className="text-xs">Видимый</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                        Отмена
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className="w-6 text-sm text-muted-foreground">{item.sort_order}</span>
                      <span className="font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">{item.href}</span>
                      {!item.is_visible && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">Скрыт</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        Редактировать
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить пункт меню?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Пункт "{item.label}" будет удалён.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)}>
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
