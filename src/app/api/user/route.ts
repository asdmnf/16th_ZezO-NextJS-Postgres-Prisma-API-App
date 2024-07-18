import prisma from "@/utils/PrismaClient";
import catchError from "@/utils/catchError";
import { getAllRecords } from "@/utils/handlersFactory";
import { Role } from "@/utils/typescript/enums";
import verifyTokenAndRole from "@/utils/verifyTokenAndRole";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// get all users handler
export async function GET(request: NextRequest) {
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

    // select fields
    const select = {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }

    // get all users
    const res = await getAllRecords(request, prisma.user, undefined, select)
    return res
  } catch (err) {
    const error = catchError(err)
    return error
  }
}