/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useTransition } from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { InfoIcon, NotebookText, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { getAllOrder } from "@/lib/action/action-order";
import { TableOrderProps } from "@/types/types";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import Badge from "../ui/badge";
import {
  orderStatusBadgeOptions,
  orderTypeBadgeOptions,
  paymentTypeBadgeOptions,
} from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import FormOrder from "../form/order/form-order";
import DialogForm from "../dialog/dialog-form";

const ChartTableLatestTransaction = () => {
  const [isFetching, startFetching] = useTransition();
  const [onRefresh, setOnRefresh] = useState(false);
  const [orderData, setOrderData] = useState<TableOrderProps[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string>();

  const fetchOrder = async () => {
    const result = await getAllOrder(1, "", "ALL", null, null, 7);
    if (result && "data" in result && result.data) {
      setOrderData(result.data);
      setOnRefresh(false);
    }
  };

  const loadData = () => {
    startFetching(async () => {
      fetchOrder();
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setOnRefresh(true);
    fetchOrder();
  };

  const handleOpenform = (id: string) => {
    setSelectedOrder(id);
    setOpenForm(true);
  };

  return (
    <>
      {isFetching && !onRefresh ? (
        <Skeleton className="h-[40vh] w-full" />
      ) : (
        <>
          <Card className="h-[40vh] w-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-1">
                <NotebookText color="var(--color-primary)" />
                Pesanan Terbaru
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
                  {orderData.length ? (
                    orderData.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>
                          <Badge
                            option={
                              orderStatusBadgeOptions.find(
                                (option) => option.value === order.status,
                              ) ?? orderStatusBadgeOptions[0]
                            }
                          />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            option={
                              orderTypeBadgeOptions.find(
                                (option) => option.value === order.type,
                              ) ?? orderTypeBadgeOptions[0]
                            }
                          />
                        </TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge
                            option={
                              paymentTypeBadgeOptions.find(
                                (option) =>
                                  option.value === order.transaction?.method,
                              ) ?? paymentTypeBadgeOptions[0]
                            }
                          />
                        </TableCell>
                        <TableCell className="w-[5%]">
                          <Button
                            className="size-8 p-0"
                            variant="ghost"
                            onClick={() => handleOpenform(order.id)}
                          >
                            <span className="sr-only">Open Detail</span>
                            <InfoIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Tidak ada Pesanan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <DialogForm
            isOpen={openForm}
            onClose={() => setOpenForm(false)}
            title="Detail Pesanan"
            contentClassName="h-[90vh] md:h-[80vh] min-w-[90vw] overflow-y-auto flex flex-col"
          >
            <FormOrder
              type="DETAIL"
              orderId={selectedOrder}
              onClose={() => setOpenForm(false)}
            />
          </DialogForm>
        </>
      )}
    </>
  );
};

export default ChartTableLatestTransaction;
