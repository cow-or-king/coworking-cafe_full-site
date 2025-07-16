import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function BlogPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        {/* Add your blog management components here */}
      </div>
    </ProtectedRoute>
  );
}
