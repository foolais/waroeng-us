/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getTotalTransactionReport } from "@/lib/action/action-report";
import { Banknote, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const ChartTotalRevenue = () => {
  const [isFetching, startFetching] = useTransition();
  const [onRefresh, setOnRefresh] = useState(false);
  const [chartData, setChartData] = useState<[number, number]>([0, 0]);

  const fetchData = async () => {
    const result = await getTotalTransactionReport(null, null);
    if (!result || "error" in result) return;

    setChartData([result._count.id || 0, result._sum.amount || 0]);
    setOnRefresh(false);
  };

  const loadData = () => {
    startFetching(async () => {
      await fetchData();
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setOnRefresh(true);
    fetchData();
  };

  return (
    <>
      {isFetching && !onRefresh ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <Card className="h-full w-full gap-4 py-6">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <Banknote color="var(--color-primary)" />
              Total Pendapatan
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
          <CardContent>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              <div className="flex items-center gap-4 px-0">
                <div className="bg-primary rounded-md border p-4 shadow">
                  <Banknote color="#fff" />
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm font-semibold">
                    Transaksi
                  </span>
                  <span className="text-xl font-bold">{chartData[0]}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 px-0">
                <div className="bg-primary rounded-md border p-4 shadow">
                  <Banknote color="#fff" />
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm font-semibold">
                    Pendapatan
                  </span>
                  <span className="text-xl font-bold">
                    {formatPrice(chartData[1])}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChartTotalRevenue;
