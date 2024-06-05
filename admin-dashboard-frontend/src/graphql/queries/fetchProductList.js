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