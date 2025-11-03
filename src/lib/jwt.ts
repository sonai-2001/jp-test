import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import User from "@/models/User";

interface JwtPayload {
  userId: string;
}

export const userAuthAuthenticated = async (
  req: NextApiRequest, // This will now have the user property
  res: NextApiResponse,
  next: () => void
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: "Please Sign-In",
    });
  }

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET!
    ) as JwtPayload;

    // Add the verified user information to the request object
    // req.user = verified;

    // Find user by ID
    const check = await User.findById(verified.userId);

    if (check) {
      next();
    } else {
      return res.status(401).json({
        status: 401,
        message: "You are blocked! Kindly contact your admin.",
      });
    }
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: 401,
        message: "Token has expired",
      });
    } else {
      return res.status(401).json({
        status: 401,
        message: "Invalid token",
      });
    }
  }
};
