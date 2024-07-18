
import BookCard from "@/components/utils/BookCard/BookCard"
import { Metadata } from "next";
import { z } from 'zod'

const postSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string()
})

type PostType = z.infer<typeof postSchema>

const MyBooksPage = async () => {
  return (
    <div></div>
  )
}

export default MyBooksPage

export const metadata: Metadata = {
  title: "My Books",
  description: "My Book Page",
};