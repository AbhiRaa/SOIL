/**
 * GraphQL mutation to add a new product to the database.
 * This operation is vital for inventory management, allowing administrators to introduce new items into the system.
 *
 * Mutation Input - ProductInput:
 * - product_name: The name of the product, essential for identification and listing.
 * - product_description: A detailed description of the product, providing potential buyers with necessary information.
 * - product_price: The price of the product, critical for sales transactions.
 * - product_image: URL to an image of the product, enhancing the visual presentation and buyer appeal.
 * - minimum_purchase_unit: The smallest quantity of the product that can be purchased, important for order management.
 * - product_stock: The quantity of the product available in inventory, crucial for stock control.
 * - is_special: Boolean indicating if the product is featured as a special item, useful for promotions.
 *
 * Returns:
 * - All the input fields along with:
 *   - product_id: Auto-generated unique identifier for the product.
 *   - created_at, updated_at: Timestamps of product creation and last update.
 *   - updated_by: Identifier of the admin who last updated the product.
 *
 * Usage:
 * This mutation is used in product management interfaces where administrators can add new products to the catalog.
 * It supports dynamic inventory expansion and helps in managing product details efficiently.
 */

import { gql } from '@apollo/client';

export const ADD_PRODUCT = gql`
  mutation AddProduct($productInput: ProductInput!) {
    addProduct(productInput: $productInput) {
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