import prisma from "@/utils/PrismaClient"
import applyValidationSchema from "@/utils/applyValidationSchema"
import catchError from "@/utils/catchError"
import { deleteRecord, getOneRecord, updateRecord } from "@/utils/handlersFactory"
import { UpdateCommentDTO } from "@/utils/typescript/DTOs"
import { Role } from "@/utils/typescript/enums"
import { CommentProps } from "@/utils/typescript/types"
import verifyTokenAndRole from "@/utils/verifyTokenAndRole"
import updateCommentSchema from "@/validation/updateCommentSchema"
import { NextRequest, NextResponse } from "next/server"

// get one comment handler
export async function GET(request: NextRequest, {params: {commentID}}: CommentProps) {
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
      }
    }
  
    // get article
    const res = await getOneRecord(prisma.comment, commentID, include, undefined, searchParams)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}

// update comment handler
export async function PUT(request: NextRequest, {params: {commentID}}: CommentProps) {
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
    const body = await request.json() as UpdateCommentDTO

    // validate request body
    const validation = applyValidationSchema(updateCommentSchema, body)
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
    }
  }

    // update comment
    const res = await updateRecord(body, prisma.comment, commentID, user?.id, include, undefined, searchParams)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}

// delete comment handler
export async function DELETE(request: NextRequest, {params: {commentID}}: CommentProps) {
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
  
    // delete comment
    const res = await deleteRecord(prisma.comment, commentID, user, undefined, undefined, searchParams)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}