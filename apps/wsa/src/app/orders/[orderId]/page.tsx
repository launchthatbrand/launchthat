"use client";

import { ArrowLeft, Calendar, CreditCard, Package, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@acme/ui/components/card";
import {
  getCustomerName,
  getPaymentMethodInfo,
  getStatusVariant,
  useOrder,
} from "../useOrders";

import { Badge } from "@acme/ui/components/badge";
import { Button } from "@acme/ui/components/button";
import { GeneralCard } from "@acme/ui/general/GeneralCard";
import Link from "next/link";
import React from "react";
import { Separator } from "@acme/ui/components/separator";
import { Skeleton } from "@acme/ui/components/skeleton";
import { formatDate } from "@acme/ui/utils/formatters";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { data, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-8 flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 lg:grid-cols-6">
          <Skeleton className="h-64 lg:col-span-4" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <GeneralCard
          title="Error"
          content={
            <div className="text-destructive">
              {error instanceof Error
                ? error.message
                : "Failed to load order details"}
            </div>
          }
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-8">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <GeneralCard
          title="Order Not Found"
          content="The requested order could not be found."
        />
      </div>
    );
  }

  const order = data;
  const customer = order.customer;

  return (
    <div className="container py-8">
      <div className="mb-8 flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2 p-0">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            Order #{order.orderNumber}
            <Badge variant={getStatusVariant(order.status)} className="ml-3">
              {order.status}
            </Badge>
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Print Order</Button>
          <Button>Process Order</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-6">
        {/* Main Content Column */}
        <div className="space-y-6 lg:col-span-4">
          {/* Order Information */}
          <GeneralCard
            title="Order Information"
            content={
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Order Number
                    </p>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{formatDate(order.date)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Payment Method
                    </p>
                    <Badge
                      variant={
                        getPaymentMethodInfo(order.paymentMethod).variant
                      }
                    >
                      {getPaymentMethodInfo(order.paymentMethod).displayName}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Subtotal</p>
                    <p className="font-medium">{order.subtotal}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-medium">{order.total}</p>
                  </div>
                </div>
              </div>
            }
          />

          {/* Ordered Items */}
          <GeneralCard
            title="Ordered Items"
            content={
              <div className="space-y-4">
                {order.lineItems && order.lineItems.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Product
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                            Price
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {order.lineItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm">
                              {item.name ?? "Product"}
                            </td>
                            <td className="px-4 py-3 text-center text-sm">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-right text-sm">
                              {item.product?.node.price ??
                                (
                                  parseFloat(item.subtotal) / item.quantity
                                ).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              {item.subtotal}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-border">
                          <td
                            colSpan={3}
                            className="px-4 py-3 text-right text-sm font-medium"
                          >
                            Subtotal
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-medium">
                            {order.subtotal}
                          </td>
                        </tr>
                        {order.shippingTotal && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-right text-sm font-medium"
                            >
                              Shipping
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              {order.shippingTotal}
                            </td>
                          </tr>
                        )}
                        {order.taxTotal && (
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-3 text-right text-sm font-medium"
                            >
                              Tax
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium">
                              {order.taxTotal}
                            </td>
                          </tr>
                        )}
                        <tr className="border-t border-border">
                          <td
                            colSpan={3}
                            className="px-4 py-3 text-right text-sm font-bold"
                          >
                            Total
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-bold">
                            {order.total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No items in this order.
                  </p>
                )}
              </div>
            }
          />

          {/* Shipping Information (if available) */}
          {order.shippingAddress && (
            <GeneralCard
              title="Shipping Information"
              content={
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="mb-2 font-medium">Shipping Address</h3>
                    <address className="not-italic text-muted-foreground">
                      {order.shippingAddress.address1}
                      <br />
                      {order.shippingAddress.address2 && (
                        <>
                          {order.shippingAddress.address2}
                          <br />
                        </>
                      )}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postcode}
                      <br />
                      {order.shippingAddress.country}
                    </address>
                  </div>
                  {order.shippingTotal && (
                    <div className="flex justify-between rounded-md border p-4">
                      <span>Shipping Cost</span>
                      <span className="font-medium">{order.shippingTotal}</span>
                    </div>
                  )}
                </div>
              }
            />
          )}
        </div>

        {/* Side Information */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Card */}
          <GeneralCard
            title="Customer"
            content={
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{getCustomerName(customer)}</h3>
                    {customer.email && (
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Customer
                  </Button>
                </div>
              </div>
            }
          />

          {/* Order Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Order Date</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Status</h3>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Payment</h3>
                    <Badge
                      variant={
                        getPaymentMethodInfo(order.paymentMethod).variant
                      }
                    >
                      {getPaymentMethodInfo(order.paymentMethod).displayName}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-bold">{order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
