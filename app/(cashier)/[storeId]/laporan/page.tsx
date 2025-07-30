import CartButton from "@/components/button/cart-btn";
import ChartOverviewOrder from "@/components/chart/chart-overview-order";
import ChartTransactionMethod from "@/components/chart/chart-transaction-method";
import { ChartColumn } from "lucide-react";
import AreaChartRevenue from "@/components/chart/area-chart-revenue";
import ChartTableLatestTransaction from "@/components/chart/chart-table-latest-transaction";

const CashierReportPage = () => {
  return (
    <div className="max-w-screen px-4 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center gap-2">
          <ChartColumn color="var(--color-primary)" />
          <h1 className="header-title">Laporan Hari Ini</h1>
        </div>
        <CartButton />
      </div>
      <div className="flex flex-col gap-4 py-4 xl:flex-row">
        <div className="w-full xl:w-[29%]">
          <ChartOverviewOrder />
        </div>
        <div className="w-full xl:w-[70%]">
          <AreaChartRevenue />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 xl:flex-row">
        <div className="w-full xl:w-[70%]">
          <ChartTableLatestTransaction />
        </div>
        <div className="w-full xl:w-[29%]">
          <ChartTransactionMethod />
        </div>
      </div>
    </div>
  );
};

export default CashierReportPage;
