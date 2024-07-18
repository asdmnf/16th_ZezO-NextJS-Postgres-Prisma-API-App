import { NextRequest, NextResponse } from "next/server"

const getRequestBody = async (request: NextRequest) => {
  try {
    const body = await request.json()
    return body
  } catch (err) {
    console.log(err)
    return NextResponse.json({
      message: err instanceof Error ? err.message : err
    }, {
      status: 400
    })
  }
}

export default getRequestBody