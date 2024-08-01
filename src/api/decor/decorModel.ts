import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

const DecorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional().nullable(),
  events: z.array(z.string()).optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});

export type Decor = z.infer<typeof DecorSchema>;

export type DecorCreatePayload = {
  id?: string;
  name: string;
  description?: string;
  menu?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type DecorUpdatePayload = {
  name?: string;
  description?: string;
};

// Input Validation for 'GET decors/:id' endpoint
export const GetDecorSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
