import express, { type Request, type Response, type Router } from "express";

import { GetAccommodationSchema } from "@/api/accommodation/accommodationModel";
import { accommodationServiceInstance } from "@/api/accommodation/accommodationService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";

export const accommodationRouter: Router = express.Router();

accommodationRouter.get("/", async (_req: Request, res: Response) => {
  const serviceResponse = await accommodationServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

accommodationRouter.get(
  "/:id",
  validateRequest(GetAccommodationSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await accommodationServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

accommodationRouter.post("/", async (req: Request, res: Response) => {
  const serviceResponse = await accommodationServiceInstance.create(req.body);
  return handleServiceResponse(serviceResponse, res);
});

accommodationRouter.put("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await accommodationServiceInstance.updateById(
    req.body,
    req.params.id
  );
  return handleServiceResponse(serviceResponse, res);
});

accommodationRouter.delete("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await accommodationServiceInstance.deleteById(
    req.params.id
  );
  return handleServiceResponse(serviceResponse, res);
});
