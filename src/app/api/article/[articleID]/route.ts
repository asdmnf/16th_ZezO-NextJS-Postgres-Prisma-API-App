import prisma from "@/utils/PrismaClient"
import applyValidationSchema from "@/utils/applyValidationSchema";
import catchError from "@/utils/catchError";
import { deleteRecord, getOneRecord, updateRecord } from "@/utils/handlersFactory";
import { UpdateArticleDTO } from "@/utils/typescript/DTOs";
import { Role } from "@/utils/typescript/enums";
import { ArticleProps } from "@/utils/typescript/types";
import verifyTokenAndRole from "@/utils/verifyTokenAndRole";
import updateArticleSchema from "@/validation/updateArticleSchema";
import { NextRequest, NextResponse } from "next/server"

// get one article handler
export async function GET(request: NextRequest, { params: { articleID } }: ArticleProps ) {
  try {
    // used with client custom fields selecting
    const { searchParams } = request.nextUrl

    // include fields
    const include = {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      comments: true,
      _count: true
    }
  
    // get article
    const res = await getOneRecord(prisma.article, articleID, include, undefined, searchParams)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}


// update article handler
export async function PUT(request: NextRequest, { params: { articleID } }: ArticleProps) {
  try {
    // used with client custom fields selecting
    const { searchParams } = request.nextUrl

    // verify token and check role
    const tokenData = await verifyTokenAndRole(request, [Role.ADMIN, Role.USER])
    if (!tokenData) {
      return NextResponse.json({message: 'internal server error'}, {
        status: 500
      })
    }
    const {user, error, status} = tokenData
    if (error || !user) {
      return NextResponse.json({
        message: error
      }, {
        status
      })
    }

    // get request body
    const body = await request.json() as UpdateArticleDTO
  
    // validate request body
    const validation = applyValidationSchema(updateArticleSchema, body)
    if (!validation?.ok) {
      return validation
    }

    // include fields
    const include = {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      comments: true,
      _count: true
    }
  
    // update article
    const res = await updateRecord(body, prisma.article, articleID, user?.id, include, undefined, searchParams)
    return res

  } catch (err) {
    const error = catchError(err)
    return error
  }
}

// delete article handler
export async function DELETE(request: NextRequest, { params: { articleID } }: ArticleProps) {
  try {
    // used with client custom fields selecting
    const { searchParams } = request.nextUrl

    // verify token and check role
    const tokenData = await verifyTokenAndRole(request, [Role.ADMIN, Role.USER])
    if (!tokenData) {
      return NextResponse.json({message: 'internal server error'}, {
        status: 500
      })
    }
    const {user, error, status} = tokenData
    if (error || !user) {
      return NextResponse.json({
        message: error
      }, {
        status
      })
    }
  
    // delete article
    const res = await deleteRecord(prisma.article, articleID, user, undefined, undefined, searchParams)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}