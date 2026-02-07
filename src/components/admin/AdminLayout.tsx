import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import ProtectedRoute from "./ProtectedRoute";

const AdminLayout = () => {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
