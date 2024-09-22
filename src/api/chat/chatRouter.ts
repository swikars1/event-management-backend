import express, { type Request, type Response, type Router } from "express";

import { GetChatSchema } from "@/api/chat/chatModel";
import { chatServiceInstance } from "@/api/chat/chatService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { authenticate, authenticateAdmin } from "@/common/middleware/auth";

export const chatRouter: Router = express.Router();

chatRouter.get("/", authenticate, async (_req: Request, res: Response) => {
  const serviceResponse = await chatServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

chatRouter.get(
  "/:id",
  validateRequest(GetChatSchema),
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await chatServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

chatRouter.post("/", authenticateAdmin, async (req: Request, res: Response) => {
  const serviceResponse = await chatServiceInstance.create(req.body);
  return handleServiceResponse(serviceResponse, res);
});

chatRouter.put(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await chatServiceInstance.updateById(
      req.body,
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);

chatRouter.delete(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await chatServiceInstance.deleteById(req.params.id);
    return handleServiceResponse(serviceResponse, res);
  }
);
