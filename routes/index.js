const express = require("express");
const router = new express.Router();
const userRoutes = require('./user');
const menuRoutes = require('./menu');
const orderRoutes = require('./order');
const paymentRoutes = require('./payment');

// router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/", (req, res) => {
  // #swagger.tags = ['Hello World']
  res.send("Hello World")
});

router.use('/users', userRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/payment', paymentRoutes);
router.use('/api-docs', require('./swagger'));



module.exports = router;