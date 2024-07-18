import prisma from "@/utils/PrismaClient";
import bcrypt from "bcryptjs";
import applyValidationSchema from "@/utils/applyValidationSchema";
import catchError from "@/utils/catchError";
import { UpdateCurrentUserDTO } from "@/utils/typescript/DTOs";
import verifyTokenAndRole from "@/utils/verifyTokenAndRole";
import updateCurrentUserSchema from "@/validation/updateCurrentUserSchema";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { fieldSelecting } from "@/utils/apiFeatures";

// get current user handler
export async function GET(request: NextRequest) {
  try {
    // verify token
    const tokenData = await verifyTokenAndRole(request)
    if (!tokenData) {
      return NextResponse.json({message: 'internal server error'}, {
        status: 500
      })
    }
    const {user, token, error, status} = tokenData
    if (error || !user) {
      return NextResponse.json({
        message: error
      }, {
        status
      })
    }

  // return response without password
  return NextResponse.json({
    ...user,
    password: undefined,
    token
  }, {
    status: 200
  })
  } catch (err) {
    const error = catchError(err)
    return error
  }
}

// update current user handler
export async function PUT(request: NextRequest) {
  try {
    // verify token
    const tokenData = await verifyTokenAndRole(request)
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
    const body = await request.json() as UpdateCurrentUserDTO

    // validate request body
    const validation = applyValidationSchema(updateCurrentUserSchema, body)
    if (!validation?.ok) {
      return validation
    }

    // check if updated email is already exists in db
    if (body.email) {
      const userRecord = await prisma.user.findUnique({
        where: {
          email: body.email
        }
      })
      if (userRecord) {
        if (user.email === body.email) {
          return NextResponse.json({
            message: 'provided email is already your email address'
          }, {
            status: 400
          })
        }
        return NextResponse.json({
          message: 'email is already exists'
        }, {
          status: 409
        })
      }
    }

    // check if user want to update password
    let hashedPassword = undefined
    if (body.password) {
      // password hashing
      hashedPassword = await bcrypt.hash(body.password, 12)
    }

    // update user
    const updatedUser: User = await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        ...body,
        password: hashedPassword
      },
      select: userSelect
    })

    // return response without password
    return NextResponse.json({
      ...updatedUser,
      password: undefined
    }, {
      status: 201
    })

  } catch (err) {
    const error = catchError(err)
    return error
  }
}

// delete current user handler
export async function DELETE(request:NextRequest) {
  try {
    // verify token
    const tokenData = await verifyTokenAndRole(request)
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
  
    // delete user
    const deletedUser = await prisma.user.delete({
      where: {
        id: user.id
      },
      select: userSelect
    })

    // return response
    return NextResponse.json({
      ...deletedUser,
      password: undefined
    }, {
      status: 201
    })
  } catch (err) {
    const error = catchError(err)
    return error
  }
}