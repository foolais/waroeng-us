"use client";

import { Button } from "../ui/button";
import { ArrowLeftRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const ChangeDashboardButton = ({
  storeId,
}: {
  storeId: string | undefined;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPath = pathname.includes("/admin");

  const handleChangeDashboard = () => {
    if (!storeId) toast.error("Toko tidak ditemukan", { duration: 1500 });

    if (isAdminPath) {
      router.push(`/${storeId}/dashboard`);
    } else {
      router.push(`/${storeId}/admin/dashboard`);
    }
  };

  return (
    <Button
      variant="ghost"
      className="flex w-full justify-start"
      onClick={handleChangeDashboard}
    >
      <ArrowLeftRight color={"var(--color-primary)"} />
      <span>{isAdminPath ? "Dashboard Kasir" : "Dashboard Admin"}</span>
    </Button>
  );
};

export default ChangeDashboardButton;
