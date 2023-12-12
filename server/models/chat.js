const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const chatSchema = new mongoose.Schema(
  {
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
    package: {
        type: ObjectId,
        ref: "Form",
        required: true,
      },
    message: [
       { type: String }
    ],
  },
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
