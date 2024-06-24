require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");

const checkoutSession2 = async ({ orderId }) => {
  try {
    // Fetch order details from database
    const order = await Order.findById(orderId).populate("products.product");
    if (!order) {
      throw new Error(`Order not found with id ${orderId}`);
    }

    // Calculate line items for Stripe session
    const lineItems = order.products.map(({ product, quantity }) => {
      const unitAmount = Math.round(parseFloat(product.price) * 100);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: unitAmount,
        },
        quantity: quantity,
      };
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5000/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5000/paymentCancel`,
      metadata: {
        orderId: order._id.toString(), // Include order ID in the metadata
      },
    });

    return session;
  } catch (error) {
    throw error;
  }
};

module.exports = { checkoutSession2 };
