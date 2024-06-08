/**
 * Product Controller: Handles all product-related operations.
 * Provides functionality for retrieving all products and specific product stock updates.
 * Each product includes associated reviews.
 */

module.exports = (db) => {
    const { Product, Review } = db.models;
    // const { sequelize } = db;

    return {
        /**
         * Retrieves all products from the database including their associated reviews.
         * Reviews are included as a nested object within each product.
         * @param {Object} req - The HTTP request object.
         * @param {Object} res - The HTTP response object.
         */
        getAllProducts: async (req, res) => {
        try {
          const products = await Product.findAll({
            include: [{
              model: Review,
              as: 'reviews',
              attributes: ['review_id', 'content', 'rating', 'is_visible', 'created_at']
            }]
          });

          res.status(200).json(products);
        } catch (error) {
          console.error("Error fetching products:", error);
          res.status(500).json({ message: "Server error" });
        }
      }, 

      /**
       * Fetches the latest stock updates for all products.
       * This can be useful for admin front-end components that need to display the most current stock information.
       * @param {Object} req - The HTTP request object.
       * @param {Object} res - The HTTP response object.
      */
      fetchProductStockUpdates: async (req, res) => {
        try {
            const products = await Product.findAll({
                attributes: ['product_id', 'product_name', 'product_price', 'minimum_purchase_unit', 'is_special', 'product_stock']
            });

            res.status(200).json({
                message: "Product stock updates fetched successfully",
                products
            });
        } catch (error) {
            console.error("Error fetching product stock updates:", error);
            res.status(500).json({ message: "Internal server error" });
        }
      }
    };
  };