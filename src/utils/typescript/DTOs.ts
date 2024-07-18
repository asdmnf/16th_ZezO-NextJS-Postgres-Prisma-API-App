import { Role } from "./enums";

// user
export interface RegisterUserDTO {
  name: string
  email: string
  password: string
  role: Role
}

export interface LoginUserDTO {
  email: string
  password: string
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: Role
}

export interface UpdateCurrentUserDTO {
  name?: string;
  email?: string;
  password?: string
}

// article
export interface ArticleDTO {
  title: string;
  description: string;
}

export type UpdateArticleDTO =  {
  title?: string;
  description?: string;
}

// comment
export interface CommentDTO {
  articleId: number
  text: string
}

export type UpdateCommentDTO = {
  articleId?: number
  text?: string
}