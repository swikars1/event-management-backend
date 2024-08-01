import express, { type Request, type Response, type Router } from "express";

import { GetThemeSchema } from "@/api/theme/themeModel";
import { themeServiceInstance } from "@/api/theme/themeService";
import {
  handleServiceResponse,
  validateRequest,
} from "@/common/utils/httpHandlers";

export const themeRouter: Router = express.Router();

themeRouter.get("/", async (_req: Request, res: Response) => {
  const serviceResponse = await themeServiceInstance.findAll();
  return handleServiceResponse(serviceResponse, res);
});

themeRouter.get(
  "/:id",
  validateRequest(GetThemeSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await themeServiceInstance.findById(id);
    return handleServiceResponse(serviceResponse, res);
  }
);

themeRouter.post("/", async (req: Request, res: Response) => {
  const serviceResponse = await themeServiceInstance.create(req.body);
  return handleServiceResponse(serviceResponse, res);
});

themeRouter.put("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await themeServiceInstance.updateById(
    req.body,
    req.params.id
  );
  return handleServiceResponse(serviceResponse, res);
});

themeRouter.delete("/:id", async (req: Request, res: Response) => {
  const serviceResponse = await themeServiceInstance.deleteById(req.params.id);
  return handleServiceResponse(serviceResponse, res);
});
