/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTransactionMethodReport } from "@/lib/action/action-report";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "../ui/skeleton";
import { HandCoins } from "lucide-react";
import { TimeRange } from "@/types/types";
import SelectorRefreshButton from "./selector-refresh-button";

const COLORS = {
  CASH: "#10B981",
  QR: "#3B82F6",
} as const;

const ChartTransactionMethod = ({
  isWithSelector = false,
}: {
  isWithSelector?: boolean;
}) => {
  const [chartData, setChartData] = useState<
    { method: string; count: number; fill: string }[]
  >([]);
  const [isFetching, startFetching] = useTransition();
  const [onRefresh, setOnRefresh] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [hasData, setHasData] = useState(false);

  const chartConfig = {
    count: {
      label: "Transactions",
    },
    CASH: {
      label: "Cash",
      color: COLORS.CASH,
    },
    QR: {
      label: "QR Code",
      color: COLORS.QR,
    },
  } satisfies ChartConfig;

  const fetchData = async (range: TimeRange) => {
    const result = await getTransactionMethodReport(range);
    if (Array.isArray(result)) {
      const data = result.map((item) => ({
        method: item.method,
        count: item._count.id,
        fill: COLORS[item.method as keyof typeof COLORS],
      }));

      setChartData(data);
      setHasData(data.length > 0 && data.some((item) => item.count > 0));
      setOnRefresh(false);
    }
  };

  const loadData = () => {
    startFetching(async () => {
      await fetchData(timeRange);
    });
  };

  const handleRefresh = () => {
    setOnRefresh(true);
    fetchData(timeRange);
  };

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    setOnRefresh(true);
    fetchData(value);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {isFetching && !onRefresh ? (
        <Skeleton className="aspect-square h-[40vh]" />
      ) : (
        <Card className="flex aspect-square h-[40vh] w-full flex-col gap-0">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <HandCoins color="var(--color-primary)" />
              Metode Pembayaran
            </CardTitle>
            <SelectorRefreshButton
              timeRange={timeRange}
              handleTimeRangeChange={handleTimeRangeChange}
              onRefresh={onRefresh}
              handleRefresh={handleRefresh}
              isWithSelector={isWithSelector}
              isWithAll={isWithSelector}
            />
          </CardHeader>
          <CardContent className="mb-4 flex-1">
            <div className="flex items-center justify-center">
              {hasData ? (
                <div className="w-full">
                  <ChartContainer
                    config={chartConfig}
                    className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px] pb-0"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <ChartLegend
                        content={<ChartLegendContent className="pt-0" />}
                      />
                      <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="method"
                        label
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="text-muted-foreground flex h-[300px] w-full flex-col items-center justify-center gap-2">
                  <HandCoins className="h-8 w-8" />
                  <p className="text-sm">Tidak ada data transaksi</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChartTransactionMethod;
