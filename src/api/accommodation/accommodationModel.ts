import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

const AccommodationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional().nullable(),
  address: z.string(),
  events: z.array(z.string()).optional().nullable(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});
export type Accommodation = z.infer<typeof AccommodationSchema>;

export type AccommodationCreatePayload = {
  id?: string;
  name: string;
  description: string;
  menu?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type AccommodationUpdatePayload = {
  name?: string;
  description?: string;
  menu?: string;
};

// Input Validation for 'GET accommodations/:id' endpoint
export const GetAccommodationSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
