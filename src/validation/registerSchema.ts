import { Role } from "@/utils/typescript/enums";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z
  .string()
  .min(3)
  ,
  role: z.enum([Role.ADMIN, Role.USER]).optional()
})
.strict();
export type RegisterUserBody = z.infer<typeof registerSchema>

export default registerSchema