"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

const ChartRevenue = () => {
  const chartData = [
    { months: "January", revenue: 4000 },
    { months: "February", revenue: 3000 },
    { months: "March", revenue: 2000 },
    { months: "April", revenue: 4000 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Laporan Pendapatan</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 10,
              right: 10,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="months"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--color-primary)"
              fillOpacity={0.2}
              stroke="var(--color-primary)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartRevenue;
