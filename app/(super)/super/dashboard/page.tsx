import CartButton from "@/components/button/cart-btn";
import ChartHistory from "@/components/chart/chart-history";
import ChartOverviewOrder from "@/components/chart/chart-overview-order";
import ChartOverviewStore from "@/components/chart/chart-overview-store";
import { ChartColumn } from "lucide-react";

const AdminDashboardPage = () => {
  return (
    <div className="py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-full items-center gap-2">
          <ChartColumn color="var(--color-primary)" />
          <h1 className="header-title">Laporan Waroeng US</h1>
        </div>
        <CartButton />
      </div>
      <ChartOverviewStore isWithStore isAll />
      <div className="flex flex-col gap-4 py-4 xl:flex-row">
        <div className="w-full xl:w-[35%]">
          <ChartOverviewOrder isWithSelector isAll />
        </div>
        <div className="w-full xl:w-[65%]">
          <ChartHistory />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
