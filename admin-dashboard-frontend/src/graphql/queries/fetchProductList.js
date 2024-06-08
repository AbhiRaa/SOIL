/**
 * GraphQL query to fetch a comprehensive list of products available in the inventory.
 * This query is designed to retrieve essential details about each product, which include
 * identifiers, pricing, stock levels, and other attributes crucial for display in
 * administrative or customer-facing interfaces.
 *
 * Returns:
 * - product_id: Unique identifier for the product, used for referencing and operations.
 * - product_name: Name of the product, displayed in listings.
 * - product_description: Detailed description of the product, useful for customer insights.
 * - product_price: Current price of the product, essential for sales operations.
 * - product_image: URL or relative path to the product's image, used for visual representation.
 * - minimum_purchase_unit: The smallest unit in which the product can be sold.
 * - product_stock: Current stock level, crucial for inventory management.
 * - is_special: Indicates if the product is featured as a special offer.
 * - created_at: Timestamp of when the product was added to the system.
 * - updated_at: Last modification timestamp, useful for tracking changes.
 * - updated_by: Identifier of the administrator who last updated the product.
 *
 * Usage:
 * This query is utilized by the administrative panels to monitor and manage the product catalog.
 * It can be used to populate product listings, edit forms, and reports. It provides a snapshot
 * of the current state of the product offerings, aiding in decisions related to sales strategies,
 * pricing adjustments, and promotional activities.
 */

import { gql } from '@apollo/client';

export const FETCH_PRODUCT_LIST = gql`
  query FetchProductList {
    products {
      product_id
      product_name
      product_description
      product_price
      product_image
      minimum_purchase_unit
      product_stock
      is_special
      created_at
      updated_at
      updated_by
    }
  }
`;