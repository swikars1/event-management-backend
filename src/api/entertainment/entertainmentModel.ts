import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

const EntertainmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  events: z.array(z.string()).optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});

export type Entertainment = z.infer<typeof EntertainmentSchema>;

export type EntertainmentCreatePayload = {
  id?: string;
  name: string;
  description?: string;
  type?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type EntertainmentUpdatePayload = {
  name?: string;
  description?: string;
  type?: string;
};

// Input Validation for 'GET entertainments/:id' endpoint
export const GetEntertainmentSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
