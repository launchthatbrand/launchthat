export interface Refund {
  amount: string;
  databaseId: number;
  date: string;
  id: string;
  reason: string;
  title: string;
}

export interface Coupon {
  code: string;
  databaseId: number;
  discount: string;
  discountTax: string;
  id: string;
  orderId: number;
}

export interface Customer {
  firstName: string;
  lastName: string;
  databaseId: number;
}

export interface Order {
  id: string;
  orderKey: string;
  orderNumber: string;
  paymentMethod: string;
  subtotal: string;
  total: string;
  transactionId: string;
  totalTax: string;
  shippingTotal: string;
  shippingTax: string;
  status: string;
  shippingAddressMapUrl: string;
  modified: string;
  datePaid: string;
  date: string;
  customer: Customer;
  refunds: {
    edges: {
      node: Refund;
    }[];
  };
  couponLines: {
    edges: {
      node: Coupon;
    }[];
  };
}

export interface OrdersResponse {
  orders: {
    edges: {
      node: Order;
    }[];
  };
}
