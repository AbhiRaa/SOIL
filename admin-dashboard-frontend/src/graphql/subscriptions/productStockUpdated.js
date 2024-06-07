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
