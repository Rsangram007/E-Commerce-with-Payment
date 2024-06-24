const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkoutSession2 } = require("../utils/Service");
 

// ** ===================  GET ALL ORDERS  ===================
const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("products.product", "name price");
  res.status(StatusCodes.OK).json({ total_orders: orders.length, orders });
};

// ** ===================  GET SINGLE ORDER  ===================
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId)
    .populate("user", "name email")
    .populate("products.product", "name price");

  if (!order) {
    throw new CustomError.BadRequestError(`No order with the id ${orderId}`);
  }

  res.status(StatusCodes.OK).json({ order });
};

// ** ===================  GET CURRENT USER ORDERS  ===================
const getCurrentUserOrder = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId }).populate(
    "products.product",
    "name price"
  );
  res.status(StatusCodes.OK).json({ total_orders: orders.length, orders });
};

// ** ===================  CREATE ORDER  ===================
const createOrder = async (req, res) => {
  const { products, shippingAddress, paymentStatus } = req.body;

  if (!products || products.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "No products provided" });
  }

  const productDetails = await Promise.all(
    products.map(async ({ product, quantity }) => {
      const productDoc = await Product.findById(product);
      if (!productDoc) {
        throw new CustomError.BadRequestError(
          `Product with id ${product} not found`
        );
      }
      return { product: productDoc._id, quantity, price: productDoc.price };
    })
  );

  const totalAmount = productDetails.reduce(
    (sum, { price, quantity }) => sum + price * quantity,
    0
  );

  const order = new Order({
    user: req.user.userId,
    products: productDetails.map(({ product, quantity }) => ({
      product,
      quantity,
    })),
    totalAmount,
    shippingAddress,
    paymentStatus,
  });

  await order.save();

  res.status(StatusCodes.CREATED).json({ order });
};

// ** ===================  UPDATE ORDER  ===================

const updateOrder = async (req, res, next) => {
  const { id: orderId } = req.params;
  const { quantity, street, city, state, postalCode, country } = req.body;

  const order = await Order.findById(orderId).populate("products.product");

  if (!order) {
    return next(
      new CustomError.BadRequestError(`No order with the id ${orderId}`)
    );
  }

  if (quantity !== undefined) {
    // Ensure the order has products
    if (order.products.length > 0) {
      const product = order.products[0].product;
      const oldQuantity = order.products[0].quantity;

      // Validate product price
      if (!product || !product.price || isNaN(product.price)) {
        return next(
          new CustomError.BadRequestError(
            `Product price is invalid for product ${product._id}`
          )
        );
      }

      // Calculate the difference in quantity
      const quantityDiff = quantity - oldQuantity;

      // Update totalAmount based on the change in quantity
      if (quantityDiff !== 0) {
        order.totalAmount += quantityDiff * product.price;
      }

      // Update product quantity
      order.products[0].quantity = quantity;
    } else {
      return next(
        new CustomError.BadRequestError(
          `No products in the order with the id ${orderId}`
        )
      );
    }
  }

  // Update shipping address fields if provided
  if (street !== undefined) order.shippingAddress.street = street;
  if (city !== undefined) order.shippingAddress.city = city;
  if (state !== undefined) order.shippingAddress.state = state;
  if (postalCode !== undefined) order.shippingAddress.postalCode = postalCode;
  if (country !== undefined) order.shippingAddress.country = country;

  try {
    await order.save();
    res.status(StatusCodes.OK).json({ order });
  } catch (error) {
    return next(new CustomError.InternalServerError(error.message));
  }
};

// ** ===================  PAYMENT FOR ORDER  ===================
const PayMentForOrder = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Order ID is required" });
  }

  const order = await Order.findById(orderId).populate("products.product");

  if (!order) {
    throw new CustomError.BadRequestError(`Order with id ${orderId} not found`);
  }

  if (!order.products || order.products.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Order does not contain any products" });
  }

  const paymentSession = await checkoutSession2({ orderId: order._id });

  // const payment = new Payment({
  //   orderId: order._id,
  //   paymentIntentId: paymentSession.id,
  //   amount: order.totalAmount,
  //   currency: "usd",
  // });

  // await payment.save();

  if (order.paymentStatus !== "completed") {
    order.paymentStatus = "completed";
    await order.save();
  }
  if (order.orderStatus !== "processing") {
    order.orderStatus = "processing";
    await order.save();
  }
  // payment.paymentStatus = "succeeded";
  // await payment.save();  
  res
    .status(StatusCodes.OK)
    .json({ sessionId: paymentSession.id, url: paymentSession.url });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
  PayMentForOrder,
};
