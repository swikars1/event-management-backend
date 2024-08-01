import express, { type Request, type Response, type Router } from "express";

import { GetDecorSchema } from "@/api/decor/decorModel";
import { decorServiceInstance } from "@/api/decor/decorService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";

export const decorRouter: Router = express.Router();

decorRouter.get("/", async (_req: Request, res: Response) => {
  const serviceResponse = await decorServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

decorRouter.get(
  "/:id",
  validateRequest(GetDecorSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await decorServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

decorRouter.post("/", async (req: Request, res: Response) => {
  const serviceResponse = await decorServiceInstance.create(req.body);
  return handleServiceResponse(serviceResponse, res);
});

decorRouter.put("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await decorServiceInstance.updateById(
    req.body,
    req.params.id
  );
  return handleServiceResponse(serviceResponse, res);
});

decorRouter.delete("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await decorServiceInstance.deleteById(req.params.id);
  return handleServiceResponse(serviceResponse, res);
});
