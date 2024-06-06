

module.exports = (db) => {
    const { Product, Review } = db.models;
    // const { sequelize } = db;

    return{
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
            }
          }
        }