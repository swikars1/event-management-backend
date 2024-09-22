import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

const ChatSchema = z.object({
  id: z.string().uuid(),

  createdAt: z.date().default(new Date()),
  updatedAt: z.date().optional(),
});

export type Chat = z.infer<typeof ChatSchema>;

export type ChatCreatePayload = {
  userA: string;
  userB: string;
};

export type ChatUpdatePayload = {
  name?: string;
  description?: string;
  type?: string;
};

// Input Validation for 'GET chats/:id' endpoint
export const GetChatSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
