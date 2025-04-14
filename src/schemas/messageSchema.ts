// Assuming this is in src/lib/validation/message.ts or similar
import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(5, { message: "Content must be atleast 5 characters long" })
    .max(300, { message: "Content must be no longer than 300 characters" }),
});

export type MessageInput = z.infer<typeof messageSchema>;
