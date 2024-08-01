import express, { type Request, type Response, type Router } from "express";

import { GetTicketSchema } from "@/api/ticket/ticketModel";
import { ticketServiceInstance } from "@/api/ticket/ticketService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";

export const ticketRouter: Router = express.Router();

ticketRouter.get("/", async (_req: Request, res: Response) => {
  const serviceResponse = await ticketServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

ticketRouter.get(
  "/:id",
  validateRequest(GetTicketSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await ticketServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

ticketRouter.post("/", async (req: Request, res: Response) => {
  const serviceResponse = await ticketServiceInstance.create(req.body);
  return handleServiceResponse(serviceResponse, res);
});

ticketRouter.put("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await ticketServiceInstance.updateById(
    req.body,
    req.params.id
  );
  return handleServiceResponse(serviceResponse, res);
});

ticketRouter.delete("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await ticketServiceInstance.deleteById(req.params.id);
  return handleServiceResponse(serviceResponse, res);
});
