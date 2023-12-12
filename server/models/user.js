const mongoose = require("mongoose");
const { Schema } = mongoose;
const {ObjectId} = Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    role: {
      type: [String],
      default: ["Subscriber"],
      enum: ["Subscriber", "Agency", "Admin"],
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
    isVerified: {
      type: Boolean,
      default: false,
    },
    packages: [{ type: ObjectId, ref: "Form" }],
    emailVerificationToken: {
      type: String,

    },
    
    date :{
      type : Date,
      default : Date.now()
    },
  },
  
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = { User };
