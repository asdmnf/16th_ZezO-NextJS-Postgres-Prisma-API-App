import catchError from "@/utils/catchError";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// logout handler
export async function GET(request: NextRequest) {
  try {
    // remove token cookie
    cookies().delete('token')

    // return response
    return NextResponse.json({
      message: 'logged out successfully'
    }, {
      status: 200
    })
  } catch (err) {
    const error = catchError(err)
    return error
  }
}