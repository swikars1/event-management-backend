import express, { type Request, type Response, type Router } from "express";

import { GetEntertainmentSchema } from "@/api/entertainment/entertainmentModel";
import { entertainmentServiceInstance } from "@/api/entertainment/entertainmentService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { authenticate, authenticateAdmin } from "@/common/middleware/auth";

export const entertainmentRouter: Router = express.Router();

entertainmentRouter.get(
  "/",
  authenticate,
  async (_req: Request, res: Response) => {
    const serviceResponse = await entertainmentServiceInstance.findAll();
    return handleServiceResponse(serviceResponse, res);
  }
);

entertainmentRouter.get(
  "/:id",
  validateRequest(GetEntertainmentSchema),
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await entertainmentServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

entertainmentRouter.post(
  "/",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await entertainmentServiceInstance.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  }
);

entertainmentRouter.put(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await entertainmentServiceInstance.updateById(
      req.body,
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);

entertainmentRouter.delete(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await entertainmentServiceInstance.deleteById(
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);
