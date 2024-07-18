import prisma from "@/utils/PrismaClient"
import bcrypt from "bcryptjs";
import { User } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import catchError from "@/utils/catchError";
import { RegisterUserDTO } from "@/utils/typescript/DTOs";
import registerSchema from "@/validation/registerSchema";
import applyValidationSchema from "@/utils/applyValidationSchema";
import { fieldSelecting } from "@/utils/apiFeatures";

// register user handler
export async function POST(request: NextRequest) {
  try {
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
    const body = (await request.json()) as RegisterUserDTO


    // validate request body
    const validation = applyValidationSchema(registerSchema, body)
    if (!validation?.ok) {
      return validation
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })
    if (existingUser) {
      return NextResponse.json({
        message: 'user already exists'
      }, {
        status: 503
      })
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(body.password, 12)

    // register user
    const user: User = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword
      },
      select: userSelect
    })

    // return response without password
    return NextResponse.json({
      ...user,
      password: undefined
    }, {
      status: 201
    })
  } catch (err) {
    const error = catchError(err)
    return error
  }
}