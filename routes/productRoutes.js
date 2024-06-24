const express = require("express");
const router = express.Router();
const {upload}=require("../utils/Cloud")
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  
} = require("../controllers/productController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .post(
    [authenticateUser, authorizePermissions("admin")],
    upload.single("image"),
    createProduct
  )
  .get(getAllProducts);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct);

module.exports = router;
