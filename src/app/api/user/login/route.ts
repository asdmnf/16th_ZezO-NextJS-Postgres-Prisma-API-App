import prisma from "@/utils/PrismaClient";
import { fieldSelecting } from "@/utils/apiFeatures";
import applyValidationSchema from "@/utils/applyValidationSchema";
import catchError from "@/utils/catchError";
import generateToken from "@/utils/generateToken";
import { LoginUserDTO } from "@/utils/typescript/DTOs";
import loginSchema from "@/validation/loginSchema";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// login handler
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
    const body = (await request.json()) as LoginUserDTO
    const {email, password} = body

    // validate request body
    const validation = applyValidationSchema(loginSchema, body)
    if (!validation?.ok) {
      return validation
    }

    // compare passwords
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email
      },
      select: userSelect ? (
        {
          id: true,
          password: true,
          ...userSelect
        }
      ) : undefined
    })
    const isPasswordTrue = await bcrypt.compare(password, user.password)
    if(!isPasswordTrue) {
      return NextResponse.json({
        message: 'invalid email or password'
      }, {
        status: 201
      })
    }

    // generate token
    const token = generateToken(user.id)

    // save token to cookies
    cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt(process.env.TOKEN_COOKIE_DURATION as string)
  })

  // return response without password
    return NextResponse.json({
      ...user,
      password: undefined,
      token
    }, {
      status: 201
    })
  } catch (err) {
    const error = catchError(err)
    return error
  }
}