const express = require("express");
const Payment = require("../models/PaymentModel");
const Order = require("../models/orderModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = "your_webhook_secret";

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      
      // Payment was successful
      const payment = new Payment({
        orderId: session.metadata.orderId,
        paymentIntentId: session.payment_intent,
        paymentStatus: "succeeded",
        amount: session.amount_total,
        currency: session.currency,
      });

      await payment.save();

      // Update order status
      await Order.findByIdAndUpdate(session.metadata.orderId, { paymentStatus: "completed", orderStatus: "processing" });

      break;

    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = app;
