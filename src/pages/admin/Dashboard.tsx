import { FileText, Layers, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSubmissionStats } from "@/hooks/useSubmissions";
import { useSections } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useSubmissionStats();
  const { data: sections, isLoading: sectionsLoading } = useSections();

  const visibleSections = sections?.filter(s => s.is_visible).length || 0;
  const totalSections = sections?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Обзор</h1>
        <p className="text-muted-foreground">Добро пожаловать в админ-панель CMS</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всего заявок</p>
              {statsLoading ? (
                <Skeleton className="h-7 w-12 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{stats?.total || 0}</p>
              )}
            </div>
          </div>
        </Card>

        {/* New Submissions */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Новые</p>
              {statsLoading ? (
                <Skeleton className="h-7 w-12 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{stats?.new || 0}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Completed */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Завершено</p>
              {statsLoading ? (
                <Skeleton className="h-7 w-12 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{stats?.completed || 0}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Sections */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Секции</p>
              {sectionsLoading ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-foreground">
                  {visibleSections}/{totalSections}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Info */}
      <Card className="p-6">
        <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
          Быстрый старт
        </h2>
        <div className="grid gap-4 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-xs">1</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Заявки</p>
              <p>Просматривайте и управляйте заявками с сайта</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-xs">2</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Секции</p>
              <p>Редактируйте контент секций сайта: заголовки, тексты, услуги</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary font-semibold text-xs">3</span>
            </div>
            <div>
              <p className="font-medium text-foreground">Настройки</p>
              <p>Управляйте контактами, интеграциями и SEO</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
