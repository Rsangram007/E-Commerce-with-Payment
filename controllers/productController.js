const Product = require("../models/productModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const path = require("path");

const { cloudinary } = require("../utils/Cloud");
// ** ===================  CREATE PRODUCT  ===================
// const createProduct = async (req, res) => {
//   req.body.user = req.user.userId
//   const product = await Product.create(req.body)
//   res.status(StatusCodes.CREATED).json({ product })

// }

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;

  // Handle file upload
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    req.body.image = result.secure_url;
  }
  console.log(req.file);

  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

// ** ===================  GET ALL PRODUCTS  ===================
const getAllProducts = async (req, res) => {
  const product = await Product.find({});
  res.status(StatusCodes.OK).json({ total_products: product.length, product });
};

// ** ===================  GET SINGLE PRODUCT  ===================
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.BadRequestError(
      `No product with the id ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

// ** ===================  UPDATE PRODUCT  ===================
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new CustomError.BadRequestError(
      `No product with the id ${productId}`
    );
  }
  res.status(StatusCodes.OK).json({ product });
};

// ** ===================  DELETE PRODUCT  ===================
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) {
    throw new CustomError.BadRequestError(
      `No product with the id ${productId}`
    );
  }
  await product.remove(); // this will trigger the pre remove hook
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed" });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
   
};
