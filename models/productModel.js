const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Please provide price value"],
      default: 0,
    },

    description: {
      type: String,
      required: [true, "Please provide description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
  
  
    category: {
      type: String,
      required: [true, "Please provide category"],
      enum: ["office", "kitchen", "bedroom"],
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    image: {
      type: String,
      default: '',
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Product", ProductSchema);
