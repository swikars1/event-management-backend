// middleware function to verify token from each api calls

import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "../utils/envConfig";
import jwt from "jsonwebtoken";
import { logger } from "@/server";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    const serviceResponse = ServiceResponse.failure(
      "Authorization token not found",
      null,
      StatusCodes.UNAUTHORIZED
    );
    return res.status(StatusCodes.UNAUTHORIZED).json(serviceResponse);
  }

  const token = req.headers.authorization.split(" ")?.[1];
  if (!token) {
    const serviceResponse = ServiceResponse.failure(
      "Authorization token not found",
      null,
      StatusCodes.UNAUTHORIZED
    );
    return res.status(StatusCodes.UNAUTHORIZED).json(serviceResponse);
  }

  try {
    const verifiedJwt = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
    };
    req.currentUser = { id: verifiedJwt.id, email: verifiedJwt.email };
    next();
  } catch (e) {
    logger.error(e);
    const serviceResponse = ServiceResponse.failure(
      "Authorization invalid.",
      null,
      StatusCodes.UNAUTHORIZED
    );
    return res.status(StatusCodes.UNAUTHORIZED).json(serviceResponse);
  }
};
