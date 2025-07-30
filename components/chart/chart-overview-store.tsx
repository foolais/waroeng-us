/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Armchair,
  Store,
  Tag,
  TrendingUp,
  Users,
  Utensils,
} from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SelectorRefreshButton from "./selector-refresh-button";
import { TimeRange } from "@/types/types";
import { getOverviewStore } from "@/lib/action/action-report";

const ChartOverviewStore = ({
  isWithStore = false,
}: {
  isWithStore?: boolean;
}) => {
  const [isFetching, startFetching] = useTransition();
  const [onRefresh, setOnRefresh] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [chartOrder, setChartOrder] = useState<
    [number, number, number, number, number]
  >([0, 0, 0, 0, 0]);

  const dataLabel = [
    "Total Toko",
    "Total Pengguna",
    "Total Meja",
    "Total Menu",
    "Total Kategori",
  ];
  const colors = ["#4F46E5", "#EC4899", "#F97316", "#10B981", "#8B5CF6"];
  const icons = [Store, Users, Armchair, Utensils, Tag];

  const fetchOverview = async (range: TimeRange) => {
    const result = await getOverviewStore(range);
    if (!result && "error" in result) return;

    setChartOrder([
      0,
      result.totalUser || 0,
      result.totalTable || 0,
      result.totalMenu || 0,
      result.totalCategory || 0,
    ]);
    setOnRefresh(false);
  };

  const loadData = () => {
    startFetching(async () => {
      await fetchOverview(timeRange);
    });
  };

  const handleRefresh = async () => {
    setOnRefresh(true);
    await fetchOverview(timeRange);
  };

  const handleTimeRangeChange = async (value: TimeRange) => {
    setTimeRange(value);
    setOnRefresh(true);
    await fetchOverview(value);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {isFetching && !onRefresh ? (
        <Skeleton className="h-36 w-full" />
      ) : (
        <Card className="h-full w-full gap-4 py-6">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <TrendingUp color="var(--color-primary)" />
              Rincian Toko
            </CardTitle>
            <SelectorRefreshButton
              timeRange={timeRange}
              handleTimeRangeChange={handleTimeRangeChange}
              onRefresh={onRefresh}
              handleRefresh={handleRefresh}
              isWithSelector={true}
              isWithAll
            />
          </CardHeader>
          <CardContent>
            <div
              className={`grid gap-4 ${isWithStore ? "lg:grid-cols-3 xl:grid-cols-5" : "lg:grid-cols-2 xl:grid-cols-4"}`}
            >
              {chartOrder &&
                Array.from({ length: isWithStore ? 5 : 4 }).map((_, index) => {
                  const startingIndex = isWithStore ? index : index + 1;
                  const IconComponent = icons[startingIndex];

                  return (
                    <div
                      key={startingIndex}
                      className="flex items-center gap-4 px-0"
                    >
                      <div
                        className="rounded-md border p-4 shadow"
                        style={{ background: colors[startingIndex] }}
                      >
                        <IconComponent color="#fff" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm font-semibold">
                          {dataLabel[startingIndex]}
                        </span>
                        <span className="text-xl font-bold">
                          {chartOrder[startingIndex]}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChartOverviewStore;
