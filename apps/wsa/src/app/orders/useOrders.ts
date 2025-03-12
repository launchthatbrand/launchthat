import { GET_ORDER, GET_ORDERS } from "./queries";

import { fetchWordPress } from "../utils/api";
import { useQuery } from "@tanstack/react-query";

// Define the type interfaces
interface Customer {
  firstName: string;
  lastName: string;
  databaseId: number;
  email?: string;
}

interface OrderItem {
  id: string;
  name?: string;
  quantity: number;
  subtotal: string;
  total: string;
  product?: {
    node: {
      id: string;
      name: string;
      price: string;
    };
  };
}

interface ShippingAddress {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  paymentMethod: string;
  date: string;
  status: string;
  total: string;
  subtotal: string;
  customer: Customer;
  lineItems?: OrderItem[];
  shippingAddress?: ShippingAddress;
  shippingTotal?: string;
  taxTotal?: string;
}

interface OrderResponse {
  order: Order & {
    lineItems?: {
      edges: {
        node: OrderItem;
      }[];
    };
  };
}

interface OrdersResponse {
  orders: {
    edges: {
      node: Order;
    }[];
  };
}

/**
 * Custom hook to fetch a single order by ID
 */
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const response = await fetchWordPress<OrderResponse>(GET_ORDER, {
        id: orderId,
      });

      if (!response?.order) {
        throw new Error("Order not found");
      }

      // Process line items
      const orderData = { ...response.order } as Order;

      // Transform line items from edges/node format to a flat array
      if (response.order.lineItems?.edges) {
        orderData.lineItems = response.order.lineItems.edges.map((edge) => {
          const item = { ...edge.node };

          // Set the name from the product if available
          if (item.product?.node) {
            item.name = item.product.node.name;
          }

          return item;
        });
      }

      return orderData;
    },
  });
}

/**
 * Custom hook to fetch all orders
 */
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetchWordPress<OrdersResponse>(GET_ORDERS);

      if (!response?.orders) {
        return [] as Order[];
      }

      return response.orders.edges.map((edge) => edge.node);
    },
  });
}

/**
 * Helper function to get customer full name
 */
export function getCustomerName(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`;
}

/**
 * Helper function to get status badge variant
 */
export function getStatusVariant(
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

/**
 * Helper function to get payment method badge variant and display name
 */
export function getPaymentMethodInfo(paymentMethod: string): {
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
