/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { getRevenueData } from "@/lib/action/action-report";
import { Wallet } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { TimeRange } from "@/types/types";
import SelectorRefreshButton from "./selector-refresh-button";

const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const AreaChartRevenue = ({
  isWithSelector = false,
  isAll = false,
}: {
  isWithSelector?: boolean;
  isAll?: boolean;
}) => {
  const { data: session, status } = useSession();
  const storeId = session?.user?.storeId;

  const [isFetching, startFetching] = useTransition();
  const [timeRange, setTimeRange] = useState<TimeRange>(
    isAll ? "all" : "today",
  );
  const [onRefresh, setOnRefresh] = useState(false);
  const [chartData, setChartData] = useState<
    { period: string; revenue: number }[]
  >([]);

  const fetchRevenue = async (range: TimeRange) => {
    try {
      const result = await getRevenueData(storeId as string, range);
      if (Array.isArray(result)) {
        setOnRefresh(false);
        setChartData(result);
      } else {
        setChartData([]);
        setOnRefresh(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = () => {
    startFetching(async () => {
      fetchRevenue(timeRange);
    });
  };

  const handleRefresh = () => {
    setOnRefresh(true);
    fetchRevenue(timeRange);
  };

  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    setOnRefresh(true);
    fetchRevenue(value);
  };

  useEffect(() => {
    if (status === "unauthenticated") return;
    loadData();
  }, [status]);

  const formatXAxis = (value: string) => value;

  return (
    <>
      {isFetching && !onRefresh ? (
        <Skeleton className="h-[450px] w-full" />
      ) : (
        <Card className="h-[450px] w-full">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <Wallet color="var(--color-primary)" />
              Laporan Pendapatan
            </CardTitle>
            <SelectorRefreshButton
              timeRange={timeRange}
              handleTimeRangeChange={handleTimeRangeChange}
              onRefresh={onRefresh}
              handleRefresh={handleRefresh}
              isWithSelector={isWithSelector}
            />
          </CardHeader>
          <CardContent className="px-4">
            {chartData.length ? (
              <ChartContainer
                config={chartConfig}
                className="h-[340px] w-full px-4"
              >
                <AreaChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={formatXAxis}
                    interval={
                      timeRange === "1month"
                        ? Math.ceil(chartData.length / 8)
                        : 0
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickCount={5}
                    tickFormatter={(value) => `Rp${value.toLocaleString()}`}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="revenue"
                    type="monotone"
                    fill="var(--color-primary)"
                    fillOpacity={0.2}
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="text-muted-foreground flex h-[450px] w-full flex-col items-center justify-center gap-2">
                <Wallet className="h-8 w-8" />
                <p className="text-sm">Tidak ada data pesanan</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AreaChartRevenue;
