const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const packagesSchema = new mongoose.Schema(
  {
  place: {
    type: String,
    required: true,
  },
  days: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,        // Store the image data as Buffer
    contentType: String, // Store the content type of the image
  },
  deadline:{
    type:Date,
    required: false
  },
  totalCount:{
    type:Number,
    required:false
  },
  paid: {
    type: Boolean,
    default: true,
  },
  instructor: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [reviewSchema], // Array of reviews
  averageRating: Number, // Store the average rating
});

const Form = mongoose.model("Form", packagesSchema);

module.exports = Form;
