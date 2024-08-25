import express, { type Request, type Response, type Router } from "express";

import { GetCateringSchema } from "@/api/catering/cateringModel";
import { cateringServiceInstance } from "@/api/catering/cateringService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { authenticate, authenticateAdmin } from "@/common/middleware/auth";

export const cateringRouter: Router = express.Router();

cateringRouter.get("/", authenticate, async (_req: Request, res: Response) => {
  const serviceResponse = await cateringServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

cateringRouter.get(
  "/:id",
  validateRequest(GetCateringSchema),
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await cateringServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

cateringRouter.post(
  "/",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await cateringServiceInstance.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  }
);

cateringRouter.put(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await cateringServiceInstance.updateById(
      req.body,
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);

cateringRouter.delete(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await cateringServiceInstance.deleteById(
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);
