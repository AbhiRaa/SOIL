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