/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  getOrderProcessReport,
  getTotalTransactionReport,
} from "@/lib/action/action-report";
import {
  NotebookText,
  RefreshCcw,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const ChartOverviewOrder = () => {
  const [isFetching, startFetching] = useTransition();
  const [onRefresh, setOnRefresh] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [chartOrder, setChartOrder] =
    useState<[number, number, number, number]>();

  const dataLabel = [
    "Total Pesanan",
    "Menunggu Pembayaran",
    "Sudah Bayar",
    "Dibatalkan",
  ];
  const colors = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"];
  const icons = [NotebookText, Clock, CheckCircle2, XCircle];

  const fetchOrder = async () => {
    const result = await getOrderProcessReport(null, null);
    if (!result) return;

    setChartOrder([
      result?.total || 0,
      result?.pending || 0,
      result?.paid || 0,
      result?.cancel || 0,
    ]);

    setOnRefresh(false);
  };

  const fetchTransaction = async () => {
    const result = await getTotalTransactionReport(null, null);
    if (!result || "error" in result) return;

    setTotalRevenue(result._sum.amount || 0);
    setOnRefresh(false);
  };

  const loadData = () => {
    startFetching(async () => {
      await fetchOrder();
      await fetchTransaction();
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setOnRefresh(true);
    fetchOrder();
    fetchTransaction();
  };

  return (
    <>
      {isFetching && !onRefresh ? (
        <Skeleton className="h-[48vh] w-full" />
      ) : (
        <Card className="h-full w-full gap-4 py-6">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <TrendingUp color="var(--color-primary)" />
              Rincian
            </CardTitle>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="w-max"
            >
              <RefreshCcw
                className={`h-4 w-4 ${onRefresh && "animate-spin"}`}
              />
            </Button>
          </CardHeader>
          <CardContent className="h-[38vh]">
            <div className="grid gap-4">
              <div className="grid gap-4">
                {chartOrder &&
                  Array.from({ length: 4 }).map((_, index) => {
                    const IconComponent = icons[index];
                    return (
                      <div key={index} className="flex items-center gap-4 px-0">
                        <div
                          className="rounded-md border p-4 shadow"
                          style={{ background: colors[index] }}
                        >
                          <IconComponent color="#fff" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm font-semibold">
                            {dataLabel[index]}
                          </span>
                          <span className="text-xl font-bold">
                            {chartOrder[index]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div>
                <div className="flex items-center gap-4 px-0">
                  <div className="bg-primary rounded-md border p-4 shadow">
                    <Wallet color="#fff" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm font-semibold">
                      Pendapatan
                    </span>
                    <span className="text-xl font-bold">
                      {formatPrice(totalRevenue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChartOverviewOrder;
