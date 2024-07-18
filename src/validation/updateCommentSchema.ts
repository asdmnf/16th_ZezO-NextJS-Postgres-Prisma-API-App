import { z } from "zod";

const updateCommentSchema = z.object({
  text: z.string().optional(),
})
.strict();

export default updateCommentSchema