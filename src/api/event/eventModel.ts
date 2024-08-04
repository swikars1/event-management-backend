import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

const EventSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string(),
  organizer: z.string(),
  organizerId: z.string(),
  tickets: z.array(z.string()),
  theme: z.string().optional().nullable(),
  themeId: z.string().optional().nullable(),
  decor: z.string().optional().nullable(),
  decorId: z.string().optional().nullable(),
  catering: z.string().optional().nullable(),
  cateringId: z.string().optional().nullable(),
  entertainment: z.string().optional().nullable(),
  entertainmentId: z.string().optional().nullable(),
  accommodation: z.string().optional().nullable(),
  accommodationId: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED", "CANCELLED"]),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});

export type Event = z.infer<typeof EventSchema>;

export type EventCreatePayload = {
  title: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  location: string;
  themeId?: string;
  decorId?: string;
  cateringId?: string;
  entertainmentId?: string;
  accommodationId?: string;
};

export type EventUpdatePayload = {
  title?: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  location?: string;
  organizerId?: string;
  themeId?: string;
  decorId?: string;
  cateringId?: string;
  entertainmentId?: string;
  accommodationId?: string;
};
// Input Validation for 'GET events/:id' endpoint
export const GetEventSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
