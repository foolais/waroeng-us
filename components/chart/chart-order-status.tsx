/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getOrderProcessReport } from "@/lib/action/action-report";
import { NotebookText, RefreshCcw } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

const ChartOrderStatus = () => {
  const [isFetching, startFetching] = useTransition();
  const [onRefresh, setOnRefresh] = useState(false);
  const [chartData, setChartData] =
    useState<[number, number, number, number]>();

  const fetchData = async () => {
    const result = await getOrderProcessReport(null, null);
    if (!result) return;

    setChartData([
      result?.total || 0,
      result?.pending || 0,
      result?.paid || 0,
      result?.cancel || 0,
    ]);

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

  const dataLabel = [
    "Total Pesanan",
    "Menunggu Pembayaran",
    "Sudah Bayar",
    "Dibatalkan",
  ];
  const colors = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444"];

  const handleRefresh = () => {
    setOnRefresh(true);
    fetchData();
  };

  return (
    <>
      {isFetching && !onRefresh ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <Card className="w-full gap-4">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <NotebookText color="var(--color-primary)" />
              Laporan Status Pesanan
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
            <div className="grid grid-cols-2 gap-4">
              {chartData &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 px-0">
                    <div
                      className="rounded-md border p-4 shadow"
                      style={{ background: colors[index] }}
                    >
                      <NotebookText color="#fff" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-sm font-semibold">
                        {dataLabel[index]}
                      </span>
                      <span className="text-xl font-bold">
                        {chartData[index]}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChartOrderStatus;
