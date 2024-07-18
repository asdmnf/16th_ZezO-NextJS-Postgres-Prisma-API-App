import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z
  .string().min(3)
})
.strict();

export type LoginBody = z.infer<typeof loginSchema>

export default loginSchema