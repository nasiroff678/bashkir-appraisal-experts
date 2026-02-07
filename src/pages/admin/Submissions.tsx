import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  RefreshCw,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useSubmissions, useDeleteSubmission, useUpdateSubmissionStatus } from "@/hooks/useSubmissions";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSubmission } from "@/types/content";
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

const statusConfig: Record<FormSubmission['status'], { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: "Новая", color: "bg-blue-500/10 text-blue-600", icon: <Clock className="w-3 h-3" /> },
  in_progress: { label: "В работе", color: "bg-yellow-500/10 text-yellow-600", icon: <Loader2 className="w-3 h-3" /> },
  completed: { label: "Завершена", color: "bg-green-500/10 text-green-600", icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: "Отменена", color: "bg-red-500/10 text-red-600", icon: <XCircle className="w-3 h-3" /> },
};

const Submissions = () => {
  const { toast } = useToast();
  const { data: submissions, isLoading, refetch } = useSubmissions();
  const deleteSubmission = useDeleteSubmission();
  const updateStatus = useUpdateSubmissionStatus();
  
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSubmissions = submissions?.filter(s => 
    statusFilter === "all" || s.status === statusFilter
  ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubmission.mutateAsync(id);
      toast({ title: "Заявка удалена" });
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const handleStatusChange = async (id: string, status: FormSubmission['status']) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast({ title: "Статус обновлён" });
    } catch {
      toast({ title: "Ошибка обновления", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Заявки</h1>
          <p className="text-muted-foreground">
            Все заявки с формы обратной связи ({filteredSubmissions.length})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="new">Новые</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="completed">Завершены</SelectItem>
                <SelectItem value="cancelled">Отменены</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Обновить
          </Button>
        </div>
      </div>

      {/* Submissions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {statusFilter === "all" ? "Заявок пока нет" : "Нет заявок с таким статусом"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-lg text-foreground">
                      {submission.name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusConfig[submission.status].color}`}>
                      {statusConfig[submission.status].icon}
                      {statusConfig[submission.status].label}
                    </span>
                    {submission.evaluation_type_label && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {submission.evaluation_type_label}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <a 
                      href={`tel:${submission.phone}`}
                      className="flex items-center gap-1.5 text-primary hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {submission.phone}
                    </a>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(submission.created_at)}
                    </span>
                  </div>

                  {submission.comment && (
                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{submission.comment}</span>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2">
                  <Select 
                    value={submission.status} 
                    onValueChange={(value: FormSubmission['status']) => handleStatusChange(submission.id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Новая</SelectItem>
                      <SelectItem value="in_progress">В работе</SelectItem>
                      <SelectItem value="completed">Завершена</SelectItem>
                      <SelectItem value="cancelled">Отменена</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <a 
                    href={`https://wa.me/${submission.phone.replace(/\D/g, "")}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="whatsapp" size="sm" className="w-full">
                      WhatsApp
                    </Button>
                  </a>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить заявку?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Заявка от {submission.name} будет удалена навсегда.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(submission.id)}>
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Submissions;
