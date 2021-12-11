const mongoose = require("mongoose")
const Schema = mongoose.Schema

const transactionSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiver: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      required: true,
      default: 'Approved'
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
)

transactionSchema.virtual('sendTo', {
  ref: 'User',
  localField: 'receiver',
  foreignField: '_id'
})

module.exports = mongoose.model("transaction", transactionSchema)