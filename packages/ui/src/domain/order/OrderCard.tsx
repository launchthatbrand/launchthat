import { formatDate, getCustomerName, getStatusVariant } from "./helpers";

import { GeneralCard } from "../../general/GeneralCard";
import type { Order } from "./types";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface OrderCardProps {
  item: Order; // Using item to match the cardComponent pattern in CardLoop
}

export function OrderCard({ item: order }: OrderCardProps) {
  return (
    <GeneralCard
      title={`Order #${order.orderNumber}`}
      subtitle={formatDate(order.date)}
      content={
        <div className="mt-2 space-y-1 text-sm">
          <p>Customer: {getCustomerName(order.customer)}</p>
          <p>Payment: {order.paymentMethod}</p>
          <p>Total: {order.total}</p>
        </div>
      }
      badge={{
        text: order.status,
        variant: getStatusVariant(order.status) as BadgeVariant,
      }}
      navigation={{
        path: `/orders/${order.id}`,
        type: "card",
      }}
      enableHoverEffects
    />
  );
}
