import express, { type Request, type Response, type Router } from "express";

import { GetChatSchema } from "@/api/chat/chatModel";
import { chatServiceInstance } from "@/api/chat/chatService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { authenticate, authenticateAdmin } from "@/common/middleware/auth";
import { prisma } from "@/common/utils/prismaInstance";

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

chatRouter.get(
  "/admin/user-chats",
  authenticateAdmin,
  async (_req: Request, res: Response) => {
    const serviceResponse = await chatServiceInstance.getUserChatsForAdmin();
    return handleServiceResponse(serviceResponse, res);
  }
);

chatRouter.get(
  "/:receiverId/history",
  authenticate,
  async (req: Request, res: Response) => {
    let receiverId = req.params.receiverId;
    console.log({ receiverId });
    const senderId = req.currentUser?.id;

    if (req.params.receiverId === "null") {
      const admin = await prisma.user.findFirst({
        where: {
          role: "ADMIN",
        },
      });
      if (!admin) return;
      receiverId = admin?.id;
    }
    if (!senderId) {
      return;
    }
    const serviceResponse = await chatServiceInstance.getChatHistory(
      receiverId,
      senderId
    );
    return handleServiceResponse(serviceResponse, res);
  }
);
