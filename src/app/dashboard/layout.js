import DashboardClientLayout from "./DashboardClientLayout";

export const metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};

export default function DashboardLayout({ children }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
