import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

const CateringSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  menu: z.string().nullable(),
  events: z.array(z.string()).optional(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});

export type Catering = z.infer<typeof CateringSchema>;

export type CateringCreatePayload = {
  id?: string;
  name: string;
  description: string;
  menu?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type CateringUpdatePayload = {
  name?: string;
  description?: string;
  menu?: string;
};

// Input Validation for 'GET caterings/:id' endpoint
export const GetCateringSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
