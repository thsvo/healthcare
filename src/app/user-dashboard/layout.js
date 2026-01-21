import UserSidebar from "@/components/UserSidebar";

export default function UserDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <UserSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
