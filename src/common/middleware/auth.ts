// middleware function to verify token from each api calls

import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { env } from "../utils/envConfig";
import jwt from "jsonwebtoken";
import { logger } from "@/server";
import { handleServiceResponse } from "../utils/httpHandlers";

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
    return handleServiceResponse(serviceResponse, res);
  }

  const token = req.headers.authorization.split(" ")?.[1];
  if (!token) {
    const serviceResponse = ServiceResponse.failure(
      "Authorization token not found",
      null,
      StatusCodes.UNAUTHORIZED
    );
    return handleServiceResponse(serviceResponse, res);
  }

  try {
    const verifiedJwt = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
    // if (verifiedJwt.role !== "USER") {
    //   const serviceResponse = ServiceResponse.failure(
    //     "Authorization invalid. Invalid role.",
    //     null,
    //     StatusCodes.UNAUTHORIZED
    //   );

    //   return handleServiceResponse(serviceResponse, res);
    // }
    req.currentUser = {
      id: verifiedJwt.id,
      email: verifiedJwt.email,
      role: verifiedJwt.role as "USER" | "ADMIN",
    };

    next();
  } catch (e) {
    logger.error(e);
    const serviceResponse = ServiceResponse.failure(
      "Authorization Error, invalid role.",
      null,
      StatusCodes.UNAUTHORIZED
    );
    return handleServiceResponse(serviceResponse, res);
  }
};

export const authenticateAdmin = (
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
    return handleServiceResponse(serviceResponse, res);
  }

  const token = req.headers.authorization.split(" ")?.[1];
  if (!token) {
    const serviceResponse = ServiceResponse.failure(
      "Authorization token not found",
      null,
      StatusCodes.UNAUTHORIZED
    );
    return handleServiceResponse(serviceResponse, res);
  }

  try {
    const verifiedJwt = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: "ADMIN" | "USER";
    };

    if (verifiedJwt.role !== "ADMIN") {
      const serviceResponse = ServiceResponse.failure(
        "Authorization invalid. No sufficient role.",
        null,
        StatusCodes.UNAUTHORIZED
      );
      return handleServiceResponse(serviceResponse, res);
    }

    req.currentUser = {
      id: verifiedJwt.id,
      email: verifiedJwt.email,
      role: verifiedJwt.role,
    };

    next();
  } catch (e) {
    logger.error(e);
    const serviceResponse = ServiceResponse.failure(
      "Authorization invalid.",
      null,
      StatusCodes.UNAUTHORIZED
    );
    return handleServiceResponse(serviceResponse, res);
  }
};
