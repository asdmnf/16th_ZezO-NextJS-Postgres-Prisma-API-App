import { z } from "zod";

const updateCurrentUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z
  .string().min(3)
  .optional()
})
.strict();

export type UpdateCurrentUserBody = z.infer<typeof updateCurrentUserSchema>

export default updateCurrentUserSchema