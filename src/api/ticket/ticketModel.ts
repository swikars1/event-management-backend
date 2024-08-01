import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

const TicketSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string(),
  userId: z.string(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});

export type Ticket = z.infer<typeof TicketSchema>;

export type TicketCreatePayload = {
  id?: string;
  eventId: string;
  userId: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type TicketUpdatePayload = {
  eventId?: string;
  userId?: string;
};

// Input Validation for 'GET tickets/:id' endpoint
export const GetTicketSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
