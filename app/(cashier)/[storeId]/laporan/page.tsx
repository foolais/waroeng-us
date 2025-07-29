import CartButton from "@/components/button/cart-btn";
import ChartOrderStatus from "@/components/chart/chart-order-status";
import ChartRevenue from "@/components/chart/chart-revenue";
import ChartTotalRevenue from "@/components/chart/chart-total-revenue";
import ChartTransactionMethod from "@/components/chart/chart-transaction-method";
import { formatDate } from "@/lib/utils";
import { ChartColumn } from "lucide-react";

const CashierReportPage = () => {
  return (
    <div className="no-scrollbar px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartColumn color="var(--color-primary)" />
          <h1 className="header-title">
            Laporan Tanggal {formatDate(new Date())}
          </h1>
        </div>
        <CartButton />
      </div>
      <div className="flex flex-col gap-4 py-4 lg:flex-row">
        <div className="w-full lg:w-[70%]">
          <ChartOrderStatus />
        </div>
        <div className="w-full lg:w-[30%]">
          <ChartTotalRevenue />
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-[70%]">
          <ChartRevenue />
        </div>
        <div className="w-full lg:w-[30%]">
          <ChartTransactionMethod />
        </div>
      </div>
    </div>
  );
};

export default CashierReportPage;
