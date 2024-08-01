import express, { type Request, type Response, type Router } from "express";

import { GetEventSchema } from "@/api/event/eventModel";
import { eventServiceInstance } from "@/api/event/eventService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";

export const eventRouter: Router = express.Router();

eventRouter.get("/", async (_req: Request, res: Response) => {
  const serviceResponse = await eventServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

eventRouter.get(
  "/:id",
  validateRequest(GetEventSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await eventServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

eventRouter.post("/", async (req: Request, res: Response) => {
  const serviceResponse = await eventServiceInstance.create(req.body);
  return handleServiceResponse(serviceResponse, res);
});

eventRouter.put("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await eventServiceInstance.updateById(
    req.body,
    req.params.id
  );
  return handleServiceResponse(serviceResponse, res);
});

eventRouter.delete("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await eventServiceInstance.deleteById(req.params.id);
  return handleServiceResponse(serviceResponse, res);
});
