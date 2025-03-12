"use client";

import type { Column, Row, Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";
import {
  getCustomerName,
  getPaymentMethodInfo,
  getStatusVariant,
  useOrders,
} from "./useOrders";

import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import { CardLoop } from "@acme/ui/general/CardLoop";
import { Checkbox } from "@acme/ui/components/checkbox";
import { DataTableColumnHeader } from "@acme/ui/components/data-table/column-header";
import { GeneralCardSkeleton } from "@acme/ui/general/GeneralCard";
import { MoreHorizontal } from "lucide-react";
import type { Order } from "./useOrders";
import React from "react";
import { formatDate } from "@acme/ui/utils/formatters";

// Custom filter function for orders
const orderCustomFilter = (order: Order, filterValue: string): boolean => {
  const searchTerm = filterValue.toLowerCase();
  const customerName = getCustomerName(order.customer).toLowerCase();

  // Make sure we handle errors gracefully
  try {
    // Search in all relevant fields including customer name
    return (
      order.orderNumber.toLowerCase().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm) ||
      order.paymentMethod.toLowerCase().includes(searchTerm) ||
      order.total.toLowerCase().includes(searchTerm) ||
      formatDate(order.date).toLowerCase().includes(searchTerm) ||
      customerName.includes(searchTerm)
    );
  } catch (error) {
    console.error("Error in search filter:", error);
    return false;
  }
};

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useOrders();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Orders</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <GeneralCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (error instanceof Error) {
    return (
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Orders</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Error loading orders: {error.message}
        </div>
      </div>
    );
  }

  // Define table columns for the orders
  const tableColumns = [
    {
      id: "select",
      header: ({ table }: { table: Table<Order> }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: Row<Order> }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <DataTableColumnHeader column={column} title="Order #" />
      ),
      cell: ({ row }: { row: Row<Order> }) => (
        <Button variant="link" className="h-auto p-0 font-medium" asChild>
          <a href={`/orders/${row.original.id}`}>{row.original.orderNumber}</a>
        </Button>
      ),
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "date",
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }: { row: Row<Order> }) => formatDate(row.original.date),
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "customer",
      id: "customerName",
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <DataTableColumnHeader column={column} title="Customer" />
      ),
      cell: ({ row }: { row: Row<Order> }) =>
        getCustomerName(row.original.customer),
      accessorFn: (row: Order) => getCustomerName(row.customer),
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <DataTableColumnHeader column={column} title="Payment" />
      ),
      cell: ({ row }: { row: Row<Order> }) => {
        const paymentInfo = getPaymentMethodInfo(row.original.paymentMethod);
        return (
          <Badge variant={paymentInfo.variant} className="whitespace-nowrap">
            {paymentInfo.displayName}
          </Badge>
        );
      },
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }: { row: Row<Order> }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
      enableSorting: true,
      enableGlobalFilter: true,
      filterFn: (row: Row<Order>, id: string, value: string[]) => {
        const status = row.getValue(id);
        return value.includes(status as string);
      },
    },
    {
      accessorKey: "total",
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: { row: Row<Order> }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href={`/orders/${order.id}`} className="flex w-full">
                  View order details
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem>View customer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>

      <CardLoop
        items={orders ?? []}
        renderItem={(order: Order) => (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                <Button
                  variant="link"
                  className="h-auto p-0 text-lg font-semibold"
                  asChild
                >
                  <a href={`/orders/${order.id}`}>Order #{order.orderNumber}</a>
                </Button>
              </h3>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Customer: {getCustomerName(order.customer)}</p>
              <div className="flex items-center gap-1">
                <span>Payment:</span>
                <Badge
                  variant={getPaymentMethodInfo(order.paymentMethod).variant}
                  className="text-xs"
                >
                  {getPaymentMethodInfo(order.paymentMethod).displayName}
                </Badge>
              </div>
              <p>Date: {formatDate(order.date)}</p>
              <p>Total: {order.total}</p>
            </div>
          </div>
        )}
        tableColumns={tableColumns}
        initialViewMode="table"
        showViewToggle
        enableRowSelection
        enableColumnVisibility
        enablePagination
        pageSize={10}
        showFilter
        customFilterFn={orderCustomFilter}
      />
    </div>
  );
}
