"use client";

import React, { useState } from "react";
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
} from "./useOrders";

// Import the generated GraphQL hooks instead of the custom hook
import { useOrdersQuery } from "@acme/db-wsa/graphql";

import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import { CardLoop } from "@acme/ui/general/CardLoop";
import { Checkbox } from "@acme/ui/components/checkbox";
import { DataTableColumnHeader } from "@acme/ui/components/data-table/column-header";
import { GeneralCardSkeleton } from "@acme/ui/general/GeneralCard";
import { MoreHorizontal } from "lucide-react";
import { formatDate } from "@acme/ui/utils/formatters";

/**
 * MIGRATION EXAMPLE
 *
 * This file demonstrates how to migrate from the custom useOrders.ts hooks
 * to the auto-generated GraphQL hooks.
 *
 * Key differences:
 * 1. Import hooks directly from @acme/db-wsa/graphql/generated/hooks
 * 2. The returned data types match exactly what's in your GraphQL schema
 * 3. No need for manual type definitions - they're all generated
 * 4. Helper functions can be moved to a separate utility file
 */

// Helper functions from your existing useOrders.ts can be moved to a utilities file
// and imported wherever needed
function getCustomerName(customer: {
  firstName: string;
  lastName: string;
}): string {
  return `${customer.firstName} ${customer.lastName}`;
}

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "on-hold":
      return "outline";
    case "cancelled":
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

function getPaymentMethodInfo(paymentMethod: string): {
  variant: "default" | "secondary" | "destructive" | "outline";
  displayName: string;
} {
  const method = paymentMethod.toLowerCase();

  if (method.includes("authorize_net")) {
    return { variant: "default", displayName: "Credit Card" };
  } else if (method.includes("sezzlepay")) {
    return { variant: "secondary", displayName: "Sezzle" };
  } else if (method.includes("stripe")) {
    return { variant: "default", displayName: "Stripe" };
  } else if (method.includes("paypal")) {
    return { variant: "secondary", displayName: "PayPal" };
  } else if (method.includes("coinbase")) {
    return { variant: "outline", displayName: "Coinbase" };
  } else {
    return { variant: "outline", displayName: paymentMethod };
  }
}

/**
 * Example of migrated OrdersPage using generated hooks
 */
export function OrdersPageWithGeneratedHooks() {
  // Use the auto-generated hooks from GraphQL CodeGen
  const { data, isLoading, error } = useOrdersQuery();

  // The rest of your component stays largely the same,
  // but with more precise typing from GraphQL CodeGen

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error loading orders: {error.message}</div>;
  }

  // Extract orders - this access pattern matches your GraphQL schema exactly
  const orders = data?.orders?.edges?.map((edge) => edge.node) || [];

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>

      <CardLoop
        items={orders}
        renderItem={(order) => (
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
              <p>Date: {formatDate(order.date)}</p>
              <p>Total: {order.total}</p>
            </div>
          </div>
        )}
        // Define your table columns here
      />
    </div>
  );
}

/**
 * Example of migrated OrderDetailsPage using generated hooks
 */
export function OrderDetailsPageWithGeneratedHooks() {
  const orderId = "YOUR_ORDER_ID"; // Get this from your router

  // Use the auto-generated hook with the orderId variable
  const { data, isLoading, error } = useOrderQuery({
    variables: {
      id: orderId,
    },
  });

  if (isLoading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>Error loading order: {error.message}</div>;
  }

  if (!data?.order) {
    return <div>Order not found</div>;
  }

  const order = data.order;

  return (
    <div className="container py-8">
      <h1 className="mb-4 text-3xl font-bold">
        Order #{order.orderNumber}
        <Badge variant={getStatusVariant(order.status)} className="ml-2">
          {order.status}
        </Badge>
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Order Details</h2>
          <div className="space-y-2">
            <p>Date: {formatDate(order.date)}</p>
            <p>Status: {order.status}</p>
            <p>Total: {order.total}</p>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-xl font-semibold">Customer</h2>
          <div className="space-y-2">
            <p>Name: {getCustomerName(order.customer)}</p>
            {order.customer.email && <p>Email: {order.customer.email}</p>}
          </div>
        </div>
      </div>

      {/* Add the rest of your order details UI */}
    </div>
  );
}

/**
 * You can also directly access the GraphQL documents if needed:
 */
export function ManualQueryExample() {
  // This is useful if you need to manually execute a query
  console.log(OrderDocument); // The GraphQL document for the Order query
  console.log(OrdersDocument); // The GraphQL document for the Orders query
}

// Define the Order type using the generated GraphQL types
type Order = {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  total: {
    value: string;
    currency: string;
  };
  paymentMethod: string;
};

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
      `${order.total.value} ${order.total.currency}`.toLowerCase().includes(searchTerm) ||
      formatDate(order.date).toLowerCase().includes(searchTerm) ||
      customerName.includes(searchTerm)
    );
  } catch (error) {
    console.error("Error in search filter:", error);
    return false;
  }
};

export default function OrdersPageMigrationExample() {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
  // Use the generated hook with pagination parameters
  const { data, isLoading, error } = useOrdersQuery({
    first: 20,
    status: statusFilter.length ? statusFilter : undefined,
  });

  // Transform the GraphQL data to the format we need
  const orders: Order[] = React.useMemo(() => {
    if (!data?.orders?.edges) return [];
    return data.orders.edges.map(edge => edge?.node as Order);
  }, [data]);

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
  if (error) {
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
        const status = row.getValue(id) as string;
        return value.includes(status);
      },
    },
    {
      accessorKey: "total",
      header: ({ column }: { column: Column<Order, unknown> }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ row }: { row: Row<Order> }) => (
        <span>
          {row.original.total.value} {row.original.total.currency}
        </span>
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

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Status Filter</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {["pending", "processing", "completed", "cancelled"].map((status) => (
            <Badge 
              key={status}
              variant={statusFilter.includes(status) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                setStatusFilter(prev => 
                  prev.includes(status) 
                    ? prev.filter(s => s !== status)
                    : [...prev, status]
                );
              }}
            >
              {status}
            </Badge>
          ))}
        </div>
      </div>

      <CardLoop
        items={orders}
        tableColumns={tableColumns}
        searchPlaceholder="Search orders..."
        customFilterFn={orderCustomFilter}
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
              <p>Total: {order.total.value} {order.total.currency}</p>
            </div>
          </div>
        )}
      />
      {data?.orders?.pageInfo?.hasNextPage && (
        <div className="mt-4 text-center">
          <Button 
            variant="outline"
            onClick={() => {
              // In a real implementation, you would use the cursor from the pageInfo
              // to fetch the next page of results
              console.log("Load more with cursor:", data.orders.pageInfo.endCursor);
            }}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
