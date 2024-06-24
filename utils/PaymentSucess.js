const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const paymentSuccess = async (req, res, next) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ msg: "Missing session ID" });
  }

  // Retrieve the session from Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const orderId = session.metadata.orderId;

  // Retrieve the order details from the database and populate 'user' and 'products'
  const order = await Order.findById(orderId)
    .populate("user", "name email")
    .populate("products.product", "name price");

  if (!order) {
    return res.status(StatusCodes.NOT_FOUND).send({ msg: "Order not found" });
  }

  // Find the corresponding payment in the database
  let payment = await Payment.findOne({ orderId });

  // If payment record doesn't exist, create a new one
  if (!payment) {
    payment = new Payment({
      orderId: order._id,
      amount: order.totalAmount,
      currency: "usd", // Assuming USD for currency
      paymentIntentId: session.payment_intent,
    });
  }

  // Update payment status to 'succeeded' in your database
  payment.paymentStatus = "succeeded";
  await payment.save();

  // Generate the HTML with order details
  const orderDetailsHTML = order.products
    .map(
      (p) => `<li>${p.product.name} - ${p.quantity} x $${p.product.price}</li>`
    )
    .join("");

  const html = `
    
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #ffcccc; /* light pink background */
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .container {
      width: 80%;
      max-width: 600px;
      padding: 30px;
      border-radius: 10px;
      background-color: #ffffff;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    }
    h1 {
      text-align: center;
      font-size: 36px;
      margin-bottom: 20px;
      color: #333333;
    }
    .success-message {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .success-message i {
      font-size: 48px;
      color: #33cc33; /* green color for success */
      margin-right: 10px;
    }
    .order-box {
      border: 2px solid #ff6600; /* orange border */
      border-radius: 8px;
      padding: 20px;
      background-color: #fff7e6; /* light orange background */
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    .order-box p {
      margin-bottom: 10px;
      font-size: 18px;
      color: #555555;
    }
    .order-box span {
      font-weight: bold;
      color: #333333;
    }
    .order-box ul {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 10px;
    }
    .order-box ul li {
      padding: 8px;
      border-bottom: 1px solid #dddddd;
      color: #555555;
    }
    .order-box ul li:last-child {
      border-bottom: none;
    }
    .contact-info {
      text-align: center;
      margin-top: 20px;
      color: #777777;
    }
    .contact-info p {
      margin-bottom: 10px;
      font-size: 16px;
    }
    .contact-info a {
      color: #ff6600; /* orange color for links */
      text-decoration: none;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Payment Successful!</h1>
    <div class="success-message">
      <i class="fas fa-check-circle"></i> <!-- You can use a checkmark icon here if desired -->
      <p style="font-size: 24px; color: #33cc33;">Thank you! Your payment has been received.</p>
    </div>
    <div class="order-box">
      <p><span>Order ID:</span> ${order._id}</p>
      <p><span>User:</span> ${order.user.name} (${order.user.email})</p>
      <ul>
        ${orderDetailsHTML} <!-- Assuming this is generated dynamically -->
      </ul>
      <p><span>Total:</span> $${order.totalAmount.toFixed(2)}</p>
    </div>
    <div class="contact-info">
      <p>Please contact us at <a href="tel:1800-XXXX-XXXX" style="color: #ff6600; text-decoration: none;">1800-XXXX-XXXX</a> or email to <a href="mailto:care@example.com" style="color: #ff6600; text-decoration: none;">care@example.com</a> for any queries.</p>
    </div>
  </div>
</body>
</html>
  `;
  res.status(StatusCodes.OK).send(html);
};

module.exports = paymentSuccess;



