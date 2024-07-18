import { z } from "zod";

const createCommentSchema = z.object({
  articleId: z.number(),
  text: z.string(),
})
.strict();

export default createCommentSchema