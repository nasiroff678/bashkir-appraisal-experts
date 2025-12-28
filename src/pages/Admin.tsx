import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, ArrowLeft, Lock, RefreshCw, Phone, Calendar, FileText, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: number;
  name: string;
  phone: string;
  type: string;
  typeName: string;
  comment: string;
  date: string;
}

const ADMIN_PASSWORD = "admin123"; // Simple password for demo

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadSubmissions();
    }
  }, []);

  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem("formSubmissions") || "[]");
    setSubmissions(data.reverse());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      loadSubmissions();
      toast({ title: "Успешный вход" });
    } else {
      toast({ title: "Неверный пароль", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleDelete = (id: number) => {
    const updatedSubmissions = submissions.filter(s => s.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem("formSubmissions", JSON.stringify(updatedSubmissions.reverse()));
    toast({ title: "Заявка удалена" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Вход в админ-панель</h1>
            <p className="text-muted-foreground mt-2">Введите пароль для доступа</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
            />
            <Button type="submit" variant="hero" size="lg" className="w-full">
              Войти
            </Button>
          </form>
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на сайт
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <h1 className="text-xl font-heading font-bold text-foreground">Админ-панель</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadSubmissions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Обновить
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              На сайт
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            Заявки ({submissions.length})
          </h2>
          <p className="text-muted-foreground text-sm">
            Все заявки с формы обратной связи
          </p>
        </div>

        {submissions.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Заявок пока нет</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg text-foreground">{submission.name}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {submission.typeName || "Не указано"}
                      </span>
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
                        {formatDate(submission.date)}
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
                    <a href={`https://wa.me/${submission.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="whatsapp" size="sm" className="w-full">
                        WhatsApp
                      </Button>
                    </a>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(submission.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
