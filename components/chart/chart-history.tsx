/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { History, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { TableHistoryProps } from "@/types/types";
import { getAllHistory } from "@/lib/action/action-history";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const ChartHistory = () => {
  const [isFetching, startFetching] = useTransition();
  const [onRefresh, setOnRefresh] = useState(false);
  const [historyData, setHistoryData] = useState<TableHistoryProps[]>([]);

  const fetchHistory = async () => {
    try {
      const result = await getAllHistory(1, "", "", 9);
      if (result && "data" in result && result.data) {
        setHistoryData(result.data);
        setOnRefresh(false);
      }

      return result;
    } catch (error) {
      console.log(error);
      toast.error(`Error ${error}`, { duration: 1500 });
      setHistoryData([]);
      setOnRefresh(false);
    }
  };

  const loadData = () => {
    startFetching(async () => {
      fetchHistory();
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setOnRefresh(true);
    fetchHistory();
  };

  return (
    <>
      {isFetching && !onRefresh ? (
        <Skeleton className="h-[48vh] w-full" />
      ) : (
        <Card className="h-[48vh] w-full">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-1">
              <History color="var(--color-primary)" />
              Riwayat
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
            <Table className="border-b">
              <TableBody>
                {historyData.length ? (
                  historyData.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>{history.actions}</TableCell>
                      <TableCell>{history.store.name}</TableCell>
                      <TableCell>{history.createdBy.name}</TableCell>
                      <TableCell>{formatDate(history.created_at)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChartHistory;
