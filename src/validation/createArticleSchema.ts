import { z } from "zod";

const createArticleSchema = z.object({
  title: z.string(),
  description: z.string(),
})
.strict();

export default createArticleSchema