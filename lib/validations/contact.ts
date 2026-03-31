import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
  title: z.string().min(1),
  company: z.string().min(1),
  message: z.string().min(1),
});

export type ContactFormData = z.infer<typeof contactSchema>;
