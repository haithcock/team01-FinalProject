// module.exports = router;
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const validate = require("../middleware/validate");
const authenticate  = require("../middleware/authenticate");

router.get("/", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Get all Order'
  orderController.getAll
);

router.get("/:id", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Get Order by ID'
  orderController.getSingle);

router.post("/", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Create a new Order'
  authenticate.isAuthenticated,
  validate.validatecreateOrders,
  orderController.createOrder
);

router.put("/:id", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Update a Order by ID'
  authenticate.isAuthenticated,
  validate.validateUpdateOrders,
  orderController.updateOrder
);

router.put("/:id/status", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Update a Order status by kitchen'
  authenticate.isAuthenticated,
  authenticate.ensureRole("kitchen"),
  validate.validateUpdateOrderStatus,
  orderController.updateOrderStatus
);

router.delete("/:id", 
  // #swagger.tags = ['Order']
  // #swagger.description = 'Delete a Order by ID'
  authenticate.isAuthenticated,
  authenticate.ensureRole("admin"),
  validate.validateDeleteOrder,
  orderController.deleteOrder
);

module.exports = router;
