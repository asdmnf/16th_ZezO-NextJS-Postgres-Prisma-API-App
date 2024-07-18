import { User } from "@prisma/client"

// user
export interface UserProps {
  params: {
    userID: string
  }
}

// article
export interface ArticleProps {
  params: { articleID: string } 
}

// comment
export interface CommentProps {
  params: {
    commentID: string
  }
}

// others
export interface CustomRegexErrorProps {
  regularExpression: RegExp
  errorMessage: string
  unmatchedMessage: string
}

export interface PaginationObject {
  limit: number
  previousPage: number
  currentPage: number
  nextPage: number
  totalPages: number
  totalResults: number
}

export type FilterObject = {
  AND: {
    [key: string]: any
  }
}

export type SelectObject = {
  [key: string]: boolean | SelectObject
}

export type IncludeObject = {
  [key: string]: boolean | IncludeObject | SelectObject
}

export type BodyType = {
  [key: string]: string | number | boolean
}

export type SelectType = Record<string , true | Record<string , true>>;


export type SubSelectObject = {
  select: {
    [key: string]: true | {}
  }
}

export type SearchObject = {
  OR: Array<{
    [key: string]: {
      contains: string,
      mode: string
    }
  }>
}

// client side
export type UserResponse = {
  ok: boolean
  error?: string
  user?: User

}

export type UpdateProfileUserData = {
  id: number
  name: string
  email:string
}