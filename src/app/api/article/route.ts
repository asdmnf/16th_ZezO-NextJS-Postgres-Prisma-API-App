import prisma from "@/utils/PrismaClient";
import { fieldSelecting } from "@/utils/apiFeatures";
import applyValidationSchema from "@/utils/applyValidationSchema";
import catchError from "@/utils/catchError";
import { getAllRecords } from "@/utils/handlersFactory";
import { ArticleDTO } from "@/utils/typescript/DTOs";
import { Role } from "@/utils/typescript/enums";
import verifyTokenAndRole from "@/utils/verifyTokenAndRole";
import createArticleSchema from "@/validation/createArticleSchema";
import { Article } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// create artile handler
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
    const body = (await request.json()) as ArticleDTO

    // validate request body
    const validation = applyValidationSchema(createArticleSchema, body)
    if (!validation?.ok) {
      return validation
    }

    // create article
    const article: Article = await prisma.article.create({
      data: {
        userId: user.id,
        title: body.title,
        description: body.description
      },
      select: userSelect
    })

    // return response
    return NextResponse.json(article, {
      status: 201
    })
  } catch (err) {
    const error = catchError(err)
    return error
  }
}

// get all articles handler
export async function GET(request: NextRequest) {
  try {
    // get all articles
    const res = await getAllRecords(request, prisma.article)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}
