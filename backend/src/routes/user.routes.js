module.exports = (express, app) => {
    const controller = require("../controllers/user.controller.js");
    const router = express.Router();

    // Select a single user with id.
  router.get("/select/:email", controller.one);

  // Select a single user with 
  router.post("/", controller.create);

  // Delete a user 
  router.delete("/delete/:email",controller.delete)

  //Update a user password
  router.put("/:email",controller.update)

  // Add routes to server.
  app.use("/api/users", router);
};