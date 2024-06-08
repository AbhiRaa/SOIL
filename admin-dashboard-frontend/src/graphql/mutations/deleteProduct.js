/**
 * GraphQL mutation to delete a product from the database.
 * This operation is critical for managing the lifecycle of products in the database,
 * allowing administrators to remove products that are no longer available or relevant.
 *
 * Mutation Input:
 * - $id: The unique identifier of the product to be deleted.
 *
 * Returns:
 * - message: A confirmation message indicating that the product has been successfully deleted.
 *
 * Usage:
 * This mutation is typically used in product management sections of the admin dashboard,
 * where administrators have the capability to curate and update the product inventory.
 *
 * Example:
 * An administrator might use this mutation to remove seasonal items that are no longer for sale
 * or products that have been discontinued by the manufacturer.
 */

import { gql } from '@apollo/client';

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      message
    }
  }
`;