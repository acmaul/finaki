import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import User from "../models/User";
import * as UserService from "../services/user.service";
import { compare } from "bcrypt";
import RefreshToken from "../models/RefreshToken";
import jwt from "jsonwebtoken";
import { IUser } from "../../types/User";
import { REFRESH_TOKEN_SECRET } from "../..";

const MAX_AGE_REFRESH_TOKEN = 3 * 30 * 24 * 60 * 60 * 1000; // 3 months

/**
 * A Promise that returns a string of access token after user logged in or registered
 * function to Generate access token and refresh token then set the refresh token as a cookie to the client then store the refresh token to the database.
 *
 * @param {Request} req - Request object
 * @param {Response} res - Response object
 * @param {IUser} user - User object
 *
 * @returns {string} access token string
 **/
async function generateAuthCredential(req: Request, res: Response, user: IUser): Promise<string> {
  try {
    // generate access token and refresh token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // set refresh token as a cookie to the client
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: MAX_AGE_REFRESH_TOKEN,
      secure: false,
    });

    const userAgent = req.get("user-agent");
    // save refresh token to database
    const savedRefreshToken = await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      userAgent: userAgent,
    });
    await UserService.pushToken(user._id, savedRefreshToken._id);

    return accessToken;
  } catch (error) {
    throw error;
  }
}

async function register(req: Request, res: Response) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { email, name, password } = req.body;
    if (await UserService.isUnique(email)) {
      return res.status(400).json({
        errors: [
          {
            msg: "Email telah terdaftar",
            param: "email",
          },
        ],
      });
    }
    const newUser = await UserService.create({ email, name, password });

    // generate access token and refresh token
    const accessToken = await generateAuthCredential(req, res, newUser);

    res.status(200).json({
      message: "User has been created successfully",
      data: {
        access_token: accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function sign(req: Request, res: Response) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: "Email tidak terdaftar",
            param: "email",
          },
        ],
      });
    }

    // compare password
    const isPassowrdValid = await compare(password, user.password);
    if (!isPassowrdValid) {
      return res.status(400).json({
        errors: [
          {
            msg: "Password salah",
            param: "password",
          },
        ],
      });
    }

    // generate access token and refresh token
    const accessToken = await generateAuthCredential(req, res, user);

    res.status(200).json({
      message: "User has been logged in successfully",
      data: {
        access_token: accessToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function refreshToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorizedsadsd",
      });
    }

    const user = await UserService.findByRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET!, (error: unknown, decoded: unknown) => {
      if (error) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
      const accessToken = generateAccessToken(user);
      res.status(200).json({
        message: "Access token has been refreshed successfully",
        data: {
          access_token: accessToken,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refresh_token;
    const user = await UserService.findByRefreshToken(refreshToken);
    if (!user) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    const deletedRefreshToken = await RefreshToken.findOneAndDelete({ token: refreshToken });
    if (!deletedRefreshToken) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }

    await UserService.pullToken(user._id, deletedRefreshToken?._id);

    res.status(200).json({
      message: "User has been logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export { register, sign, refreshToken, logout };
