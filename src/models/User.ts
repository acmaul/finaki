import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    defaultWallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    refreshTokens: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RefreshToken",
      },
    ],
    wallets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
      },
    ],
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// UserSchema.methods.isValidPassword = async function (password: string) {
//   const compare = await bcrypt.compare(password, this.password);
//   return compare;
// };

export default mongoose.model("User", UserSchema);
