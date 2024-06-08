/**
 * GraphQL mutation for editing an existing product in the database.
 * This operation allows administrators to update the details of a product,
 * ensuring the product information is current and accurate.
 *
 * Mutation Input:
 * - $id: The unique identifier of the product to be updated.
 * - $productInput: An object containing the new product details.
 *
 * Returns:
 * - product_id: Unique identifier of the product.
 * - product_name: Name of the product.
 * - product_description: Description of the product.
 * - product_price: Price of the product.
 * - product_image: Image URL of the product.
 * - minimum_purchase_unit: The minimum quantity that can be purchased.
 * - product_stock: Quantity available in inventory.
 * - is_special: Boolean indicating if the product is featured as a special item.
 * - updated_at: Timestamp of the last update.
 *
 * Usage:
 * This mutation is typically employed in the product management interface of the admin dashboard,
 * where administrators can adjust product listings to reflect changes in pricing, availability,
 * descriptions, or special promotions.
 *
 * Example:
 * An administrator updates the price and stock quantity of a popular item ahead of a promotional event,
 * ensuring the inventory levels are sufficient and the pricing is competitive.
 */

import { gql } from '@apollo/client';

export const EDIT_PRODUCT = gql`
  mutation EditProduct($id: ID!, $productInput: ProductInput!) {
    editProduct(id: $id, productInput: $productInput) {
      product_id
      product_name
      product_description
      product_price
      product_image
      minimum_purchase_unit
      product_stock
      is_special
      updated_at
    }
  }
`;