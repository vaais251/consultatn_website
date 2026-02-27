import AdminLayout from "@/app/admin/components/AdminLayout";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}
