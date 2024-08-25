import express, { type Request, type Response, type Router } from "express";

import { GetEventSchema } from "@/api/event/eventModel";
import { eventServiceInstance } from "@/api/event/eventService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { authenticate, authenticateAdmin } from "@/common/middleware/auth";

export const eventRouter: Router = express.Router();

eventRouter.get(
  "/",
  authenticateAdmin,
  async (_req: Request, res: Response) => {
    const serviceResponse = await eventServiceInstance.findAll();
    return handleServiceResponse(serviceResponse, res);
  }
);

eventRouter.get(
  "/bookings",
  authenticate,
  async (req: Request, res: Response) => {
    const id = req.currentUser?.id;
    const serviceResponse = await eventServiceInstance.findAllUserBookings(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

eventRouter.get(
  "/:id",
  validateRequest(GetEventSchema),
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await eventServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

eventRouter.post("/", authenticate, async (req: Request, res: Response) => {
  const organizerId = req.currentUser?.id;
  const serviceResponse = await eventServiceInstance.create({
    ...req.body,
    organizerId,
  });
  return handleServiceResponse(serviceResponse, res);
});

eventRouter.put(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await eventServiceInstance.updateById(
      req.body,
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);

eventRouter.delete(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await eventServiceInstance.deleteById(
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);

eventRouter.delete(
  "/bookings/:id",
  authenticate,
  async (req: Request, res: Response) => {
    const userId = req.currentUser?.id;
    const serviceResponse = await eventServiceInstance.deleteBookingById(
      req.params.id,
      userId
    );
    return handleServiceResponse(serviceResponse, res);
  }
);
