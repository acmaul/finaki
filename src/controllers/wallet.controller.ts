import { Request, Response } from "express";
import Wallet from "../models/Wallet";
import * as WalletService from "../services/wallet.service";
import { validationResult } from "express-validator";
import { Types } from "mongoose";

export async function createWallet(req: Request, res: Response) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const userId = req.user;
    const { name, balance } = req.body;
    const newWallet = await WalletService.create({
      userId,
      name,
      balance,
    });
    return res.status(201).json({
      message: "Wallet has been created successfully",
      data: {
        _id: newWallet._id,
        name: newWallet.name,
        balance: newWallet.balance,
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export async function getAllWallets(req: Request, res: Response) {
  try {
    const userId = req.user;
    const wallets = await Wallet.find({ userId: userId }).select({
      _id: 1,
      name: 1,
      balance: 1,
    });
    return res.status(200).json({
      message: "Wallets has been fetched successfully",
      data: wallets,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteWallet(req: Request, res: Response) {
  try {
    const id = req.query.id as unknown;
    const deletedWallet = await WalletService.deleteById(id as Types.ObjectId);
    if (!deletedWallet) return res.status(404).json({ message: "Wallet not found" });
    console.log(deletedWallet);

    res.json({
      message: "Wallet has been deleted successfully",
      data: {
        _id: deletedWallet._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
