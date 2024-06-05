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