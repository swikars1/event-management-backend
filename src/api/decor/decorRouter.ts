import express, { type Request, type Response, type Router } from "express";

import { GetDecorSchema } from "@/api/decor/decorModel";
import { decorServiceInstance } from "@/api/decor/decorService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { authenticate, authenticateAdmin } from "@/common/middleware/auth";

export const decorRouter: Router = express.Router();

decorRouter.get("/", authenticate, async (_req: Request, res: Response) => {
  const serviceResponse = await decorServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

decorRouter.get(
  "/:id",
  validateRequest(GetDecorSchema),
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await decorServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

decorRouter.post(
  "/",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await decorServiceInstance.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  }
);

decorRouter.put(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await decorServiceInstance.updateById(
      req.body,
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);

decorRouter.delete(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await decorServiceInstance.deleteById(
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);
