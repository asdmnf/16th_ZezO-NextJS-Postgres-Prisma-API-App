import prisma from "@/utils/PrismaClient";
import { fieldSelecting } from "@/utils/apiFeatures";
import applyValidationSchema from "@/utils/applyValidationSchema";
import catchError from "@/utils/catchError";
import { getAllRecords } from "@/utils/handlersFactory";
import { CommentDTO } from "@/utils/typescript/DTOs";
import { Role } from "@/utils/typescript/enums";
import verifyTokenAndRole from "@/utils/verifyTokenAndRole";
import createCommentSchema from "@/validation/createCommentSchema";
import { Comment } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// create comment handler
export async function POST(request: NextRequest) {
  try {
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

    // fields selecting
    let userSelect = undefined
    const selectQuery = request.nextUrl?.searchParams?.get('select')
    if (selectQuery) {
      const { select, error, status } = await fieldSelecting(selectQuery)
      if (error) {
        return NextResponse.json({
          message: error
        }, {
          status
        })
      }
      userSelect = select
    }

    // get request body
    const body = (await request.json()) as CommentDTO
    const {articleId, text} = body

    // validate request body
    const validation = applyValidationSchema(createCommentSchema, body)
    if (!validation?.ok) {
      return validation
    }

    // check if article exists
    await prisma.article.findUniqueOrThrow({
      where: {
        id: articleId
      }
    })

    // check if user commented before
    const isUserCommentedBefore = await prisma.comment.findFirst({
      where: {
        AND: {
          userId: user.id,
          articleId
        },
      }
    })
    if(isUserCommentedBefore) {
      return NextResponse.json({
        message: 'you have been already commented before'
      }, {
        status: 201
      })
    }

    // create comment
    const comment: Comment = await prisma.comment.create({
      data: {
        userId: user.id,
        articleId,
        text,
      },
      select: userSelect
    })

    // return response
    return NextResponse.json(comment, {
      status: 201
    })
  } catch (err) {
    const error = catchError(err)
    return error
  }
}

// get all comments handler
export async function GET(request: NextRequest) {
  try {
    // get all comments
    const res = await getAllRecords(request, prisma.comment)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}