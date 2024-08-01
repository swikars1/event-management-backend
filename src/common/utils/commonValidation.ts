import { z } from "zod";

export const commonValidations = {
  id: z
    .string()
    .uuid({ message: "Invalid ID" }),
};
