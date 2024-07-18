import prisma from "@/utils/PrismaClient"
import { fieldSelecting } from "@/utils/apiFeatures";
import applyValidationSchema from "@/utils/applyValidationSchema";
import catchError from "@/utils/catchError"
import { deleteRecord } from "@/utils/handlersFactory";
import { UpdateUserDTO } from "@/utils/typescript/DTOs";
import { Role } from "@/utils/typescript/enums";
import { UserProps } from "@/utils/typescript/types";
import verifyTokenAndRole from "@/utils/verifyTokenAndRole";
import updateUserSchema from "@/validation/updateUserSchema";
import { User } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

// get one user handler
export async function GET(request: NextRequest, {params: {userID}}: UserProps) {
  try {
    // verify token and check role
    const tokenData = await verifyTokenAndRole(request, [Role.ADMIN])
    if (!tokenData) {
      return NextResponse.json({message: 'internal server error'}, {
        status: 500
      })
    }
    const {error, status} = tokenData
    if (error) {
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

    // get user
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: parseInt(userID)
      },
      select: userSelect ? userSelect : (
        {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          articles: true,
          comments: true,
          _count: true,
        }
      )
    })

    // return response without password
    return NextResponse.json({
      ...user,
      password: undefined
    }, {
      status: 200
    })
  } catch (err) {
    const error = catchError(err)
    return error
  }
}

// update user handler
export async function PUT(request: NextRequest, {params: {userID}}: UserProps) {
  try {
    // verify token and check role
    const tokenData = await verifyTokenAndRole(request, [Role.ADMIN])
    if (!tokenData) {
      return NextResponse.json({message: 'internal server error'}, {
        status: 500
      })
    }
    const {error, status} = tokenData
    if (error) {
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
    const body = await request.json() as UpdateUserDTO

    // validate request body
    const validation = applyValidationSchema(updateUserSchema, body)
    if (!validation?.ok) {
      return validation
    }

    // check if user exists
    const existingUser: User = await prisma.user.findFirstOrThrow({
      where: {
        id: parseInt(userID)
      }
    })

    // check if updated email is exists
    if (body.email) {
      const user = await prisma.user.findUnique({
        where: {
          email: body.email
        }
      })
      if (user) {
        if (existingUser.email === body.email) {
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

    // update user
    const updatedUser: User = await prisma.user.update({
      where: {
        id: parseInt(userID)
      },
      data: body,
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

// delete user handler
export async function DELETE(request: NextRequest, {params: {userID}}: UserProps) {
  try {
    // verify token and check role
    const tokenData = await verifyTokenAndRole(request, [Role.ADMIN])
    if (!tokenData) {
      return NextResponse.json({message: 'internal server error'}, {
        status: 500
      })
    }
    const {error, status} = tokenData
    if (error) {
      return NextResponse.json({
        message: error
      }, {
        status
      })
    }

    // used with client custom fields selecting
    const { searchParams } = request.nextUrl
  
    // select fields
    const select = {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  
    // delete user
    const res = await deleteRecord(prisma.user, userID, undefined, undefined, select, searchParams)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}