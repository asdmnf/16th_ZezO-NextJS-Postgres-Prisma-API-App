import { Role } from "@/utils/typescript/enums";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: z.enum([Role.ADMIN, Role.USER]).optional()
})
.strict();

export default updateUserSchema