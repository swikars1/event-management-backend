import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

const ThemeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional().nullable(),
  events: z.array(z.string()).optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});

export type Theme = z.infer<typeof ThemeSchema>;

export type ThemeCreatePayload = {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type ThemeUpdatePayload = {
  name?: string;
  description?: string;
};

// Input Validation for 'GET themes/:id' endpoint
export const GetThemeSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
