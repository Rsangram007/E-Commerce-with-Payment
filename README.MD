
# eCommerce REST API
This is a REST API built using Node.js and Express.js for eCommerce. It provides endpoints for user authentication, product management, review management, and order management.


## Features

- User registration
- User login and logout
- Product creation, update, deletion, and retrieval
- Order creation, update, deletion, and retrieval
- Payment creation, After Create Order
- Image upload for products
- JWT-based authentication

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe Account](https://stripe.com/)

## Tech Stack
**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
 

**Image Upload:** 
- Cloudinary API

**Data Storage:** 
- MongoDB

**User Authentication:**
- JSON Web Tokens (JWT)
## API Reference

#### User Authentication
- `POST /api/v1/auth/register` - Register a new user.
- `POST /api/v1/auth/login` -    Login with an existing user.
- `GET /api/v1/auth/logout` -    Logout the current user.

#### User
- `GET /api/v1/users` - Get all users.
- `GET /api/v1/users/:id` -    Get single user.
- `GET /api/v1/users/showMe` -  Show current user.
- `PATCH /api/v1/users/updateUser` -  Update user profile.
- `PATCH /api/v1/users/updateUserPassword` -  Update User Password.

#### Products
- `GET /api/v1/products` - Get all products.
- `POST /api/v1/products` -    Create a new product.
- `GET /api/v1/products/:id` -    Get a single product by ID .
- `PATCH /api/v1/products/:id` -   Update a product by ID .
- `DELETE /api/v1/products/:id` -   Delete a product by ID .
 



#### Order
- `GET /api/v1/orders` - Get all orders.
- `POST /api/v1/orders` -    Create a order .
- `GET /api/v1/orders/:id` -    Get a single order.
- `PATCH /api/v1/orders/:id` -   Update a order.
- `GET /api/v1/orders/showAllMyOrder` -   Get a current user orders.


### 7. Order Checkout
**Endpoint:** `POST  api/v1/orders/Payment`

**Description:** `After Creates a new order and initiates a Stripe payment session.`


**Input:**
```
{
   "orderId":"6679790e90312ce7579b9212"
}


**Response:**

```
{
    "sessionId": "cs_test_a1ukiTBZEGa3hEbKP2ggOtbadZiVQ1cRIw1Bm1HneSTScQahfjLIIaGgO5",
    "url": "https://checkout.stripe.com/c/pay/cs_test_a1ukiTBZEGa3hEbKP2ggOtbadZiVQ1cRIw1Bm1HneSTScQahfjLIIaGgO5#fidkdWxOYHwnPyd1blpxYHZxWjA0VUpmXG5DbWpSbF9EQmsya2FMd3ZNNkhzMl1xb3YzR2xuSGhKS0tOandTVzAwcXFVQUxNN1A0ZkFOb0pwQ0dORGtzYFJ9dDNyUGpoVl9XYjJzXExyfVNLNTV8R1ZEaGJQbicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"
}
```

```
i am attaching duplicate stripe card details for stripe payment ,you can use this 

card no : 4242424242424242
Expiry : 02/28
cvv : 453
```

## Installation


1. Clone the repository.


```
git clone https://github.com/Rsangram007/Ecommerce-With-Payment.git
```

2. Navigate to the project directory.

```
cd E-commerce
```

3. Install the dependencies.

```
npm install 
```

4. Set the environment variables in a .env file in the root directory of the project. 
Example:
```
PORT=5000
MONGO_URL=****
JWT_SECRET=your_secret_key_here
JWT_LIFETIME=1d
CLOUDINARY_CLOUD_NAME=*****
CLOUDINARY_API_KEY=******
CLOUDINARY_API_SECRET=*****
STRIPE_SECRET_KEY=******
STRIPE_WEBHOOK_SECRET=*****
```

5. Start the application.

```
npm run dev

```
## License
Indago is licensed under the MIT License. See the LICENSE file for more information.



## Feedback

Please let us know your thoughts on my app by sending any suggestions or feedback to sangrambeheraa007@gmail.com.


## 🚀 About Me
- Backend developer with experience in modern web development
- intermidate in React and JavaScript for frontend development
- Experienced in Node.js and Express.js for backend development
- Ability to create efficient and high-performance server-side applications
- Proficient in using TailwindCSS for creating visually appealing and responsive user interfaces
- Passionate about building user-friendly and efficient applications using cutting-edge technologies
- Always eager to learn new technologies and improve skills to provide the best solutions to clients.



