import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
  role: z.nativeEnum({ USER: "USER", ADMIN: "ADMIN" }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export type UserCreatePayload = {
  id?: string;
  email: string;
  name: string;
  password: string;
  role?: "USER" | "ADMIN";
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type UserUpdatePayload = {
  email?: string;
  name?: string;
};

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
