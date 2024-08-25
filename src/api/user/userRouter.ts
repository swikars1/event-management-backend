import express, { type Request, type Response, type Router } from "express";

import { GetUserSchema } from "@/api/user/userModel";
import { userServiceInstance } from "@/api/user/userService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";
import { authenticate, authenticateAdmin } from "@/common/middleware/auth";

export const userRouter: Router = express.Router();

userRouter.get("/", authenticateAdmin, async (_req: Request, res: Response) => {
  const serviceResponse = await userServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

userRouter.get(
  "/:id",
  authenticateAdmin,
  validateRequest(GetUserSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await userServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

userRouter.post("/", authenticateAdmin, async (req: Request, res: Response) => {
  const serviceResponse = await userServiceInstance.signUp(req.body);
  return handleServiceResponse(serviceResponse, res);
});

userRouter.put(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await userServiceInstance.updateById(
      req.body,
      req.params.id
    );
    return handleServiceResponse(serviceResponse, res);
  }
);

userRouter.delete(
  "/:id",
  authenticateAdmin,
  async (req: Request, res: Response) => {
    const serviceResponse = await userServiceInstance.deleteById(req.params.id);
    return handleServiceResponse(serviceResponse, res);
  }
);

userRouter.post("/login", async (req: Request, res: Response) => {
  const serviceResponse = await userServiceInstance.login(req.body);
  return handleServiceResponse(serviceResponse, res);
});

userRouter.post("/register", async (req: Request, res: Response) => {
  const serviceResponse = await userServiceInstance.signUp(req.body);
  return handleServiceResponse(serviceResponse, res);
});

userRouter.post("/admin-login", async (req: Request, res: Response) => {
  const serviceResponse = await userServiceInstance.adminLogin(req.body);
  return handleServiceResponse(serviceResponse, res);
});
