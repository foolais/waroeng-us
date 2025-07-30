import { auth } from "@/auth";
import CartButton from "@/components/button/cart-btn";
import AreaChartRevenue from "@/components/chart/area-chart-revenue";
import ChartOverviewOrder from "@/components/chart/chart-overview-order";
import ChartOverviewStore from "@/components/chart/chart-overview-store";
import ChartTableLatestTransaction from "@/components/chart/chart-table-latest-transaction";
import ChartTransactionMethod from "@/components/chart/chart-transaction-method";
import { getStoreById } from "@/lib/action/action-store";
import { ChartColumn } from "lucide-react";

const AdminDashboardPage = async () => {
  const session = await auth();
  const storeId = session?.user?.storeId;
  if (!storeId) return <div></div>;

  const store = await getStoreById(storeId);
  if ("error" in store) {
    return <div></div>;
  }

  return (
    <div className="py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-full items-center gap-2">
          <ChartColumn color="var(--color-primary)" />
          <h1 className="header-title">Laporan Warung {store.name}</h1>
        </div>
        <CartButton />
      </div>
      <ChartOverviewStore />
      <div className="flex flex-col gap-4 py-4 xl:flex-row">
        <div className="w-full xl:w-[35%]">
          <ChartOverviewOrder isWithSelector />
        </div>
        <div className="w-full xl:w-[65%]">
          <AreaChartRevenue isWithSelector />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <div className="w-full xl:w-[65%]">
          <ChartTableLatestTransaction />
        </div>
        <div className="w-full xl:w-[35%]">
          <ChartTransactionMethod isWithSelector />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
