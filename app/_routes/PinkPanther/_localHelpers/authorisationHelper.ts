import Crypto from "crypto";
import { type NextFunction, type Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import type { I_JWTToken } from "../Authentication/Authentication-Model";
import type { I_RequestUser } from "../Users/Users-Model";
import UserSchema from "../Users/Users-Model";

// Protect routes
export const protect = asyncHandler(async (req: I_RequestUser, res: Response, next: NextFunction) => {
  if (!req.cookies[process.env.JWT_FGP_COOKIENAME] || !req.cookies.token) {
    next(res.status(403).json({ status: "error", message: "No token provided" }));
  }

  const token = req.cookies.token;
  const userFingerprint = req.cookies[process.env.JWT_FGP_COOKIENAME];

  if (!token || !userFingerprint) {
    console.error("token & FGP check");
    next(res.status(401).json({ status: "error", message: "Not authorized" }));
  }

  if (typeof userFingerprint !== "string") {
    console.error("check type string");
    next(res.status(401).json({ status: "error", message: "Not authorized" }));
  }

  try {
    const { userId, userFingerPrint, usercsrf } = jwt.verify(token, process.env.JWT_SECRET) as I_JWTToken;

    if (userFingerPrint !== Crypto.createHash("sha256").update(userFingerprint).digest("hex")) {
      console.error("FGP check");
      next(res.status(401).json({ status: "error", message: "Not authorized" }));
    }

    // @ts-expect-error
    if (usercsrf !== Crypto.createHash("sha256").update(req.headers.usercsrf).digest("hex")) {
      console.error("CSRF check");
      next(res.status(401).json({ status: "error", message: "Not authorized" }));
    }

    req.user = await UserSchema.findById(userId);

    next();
  } catch (err) {
    next(res.status(401).json({ status: "error", message: "Not authorized Error" }));
  }
});

// Grant access to specific roles
export const authorizedRoles = (...roles: string[]) => {
  return (req: I_RequestUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      next(
        res
          .status(403)
          .json({ status: "error", message: `User role ${req.user.role} is not authorized to access this route` })
      );
    }
    next();
  };
};

export default protect;
