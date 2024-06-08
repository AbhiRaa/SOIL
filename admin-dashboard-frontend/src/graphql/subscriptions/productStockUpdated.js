/**
 * GraphQL subscription for receiving updates on product stock levels.
 * This subscription is vital for monitoring changes in the stock of products, which can
 * assist in managing inventory more effectively. It provides key details about each product,
 * such as its name, current stock levels, and pricing information.
 *
 * Fields:
 * - product_id: Unique identifier of the product.
 * - product_name: Name of the product.
 * - product_price: Current price of the product.
 * - minimum_purchase_unit: The smallest quantity of the product that can be purchased.
 * - is_special: Boolean flag indicating whether the product is a special item, potentially linked to promotions or special events.
 * - product_stock: The current quantity available in stock.
 *
 * Usage:
 * This subscription is crucial for backend systems where real-time data about product availability
 * is required for operations such as order processing, stock replenishment, and sales forecasting.
 * Administrators and logistics personnel can use these updates to ensure product availability,
 * plan procurement, and avoid stockouts.
 */

import { gql } from '@apollo/client';

export const PRODUCT_STOCK_UPDATED = gql`
  subscription ProductStockUpdated {
    productStockUpdated {
      product_id
      product_name
      product_price
      minimum_purchase_unit
      is_special
      product_stock
    }
  }
`;
