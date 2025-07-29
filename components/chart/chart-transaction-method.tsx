/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Pie, PieChart, Label } from "recharts";
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
import { Button } from "../ui/button";
import { HandCoins, RefreshCcw } from "lucide-react";

const COLORS = {
  CASH: "#10B981",
  QR: "#3B82F6",
} as const;

const ChartTransactionMethod = () => {
  const [chartData, setChartData] = useState<
    { method: string; count: number; fill: string }[]
  >([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [isFetching, startFetching] = useTransition();
  const [onRefresh, setOnRefresh] = useState(false);

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

  const fetchData = async () => {
    const result = await getTransactionMethodReport(null, null);
    if (Array.isArray(result)) {
      const data = result.map((item) => ({
        method: item.method,
        count: item._count.id,
        fill: COLORS[item.method as keyof typeof COLORS],
      }));
      const totalData = data.reduce((acc, item) => acc + item.count, 0);

      setChartData(data);
      setTotalTransactions(totalData);
      setOnRefresh(false);
    }
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
        <Skeleton className="aspect-square max-h-[25rem] min-h-[25rem]" />
      ) : (
        <Card className="flex aspect-square max-h-[25rem] w-full flex-col gap-0">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <HandCoins color="var(--color-primary)" />
              Metode Pembayaran
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
          <CardContent className="mb-4 flex-1">
            <div className="flex items-center justify-center">
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
                      innerRadius={60}
                      strokeWidth={2}
                      label
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {totalTransactions.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Transaksi
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChartTransactionMethod;
