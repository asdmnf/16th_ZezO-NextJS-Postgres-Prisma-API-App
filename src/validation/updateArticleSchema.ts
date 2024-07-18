import { z } from "zod";

const updateArticleSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})
.strict();

export default updateArticleSchema