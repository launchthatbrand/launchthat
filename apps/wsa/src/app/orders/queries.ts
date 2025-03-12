// GraphQL query for orders
export const GET_ORDERS = `
  query GetOrders {
    orders(first: 100) {
      edges {
        node {
          id
          orderNumber
          paymentMethod
          date
          status
          total
          customer {
            firstName
            lastName
            databaseId
          }
        }
      }
    }
  }
`;

// GraphQL query for a single order
export const GET_ORDER = `
  query GetOrder($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      date
      status
      total
      subtotal
      shippingTotal
      taxTotal
      paymentMethod
      customer {
        firstName
        lastName
        databaseId
        email
      }
      lineItems {
        edges {
          node {
            id
            quantity
            subtotal
            total
            product {
              node {
                ... on SimpleProduct {
                  id
                  name
                  price
                }
                ... on VariableProduct {
                  id
                  name
                  price
                }
              }
            }
          }
        }
      }
      shippingAddress {
        address1
        address2
        city
        state
        postcode
        country
      }
    }
  }
`;
