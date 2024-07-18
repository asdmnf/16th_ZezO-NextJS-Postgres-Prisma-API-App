'use server'

import prisma from "@/utils/PrismaClient"
import bcrypt from "bcryptjs";
import serverActionCatchError from "@/utils/serverActionCatchError"
import loginSchema, { LoginBody } from "@/validation/loginSchema"
import generateToken from "@/utils/generateToken";
import { cookies } from "next/headers";

const loginServerAction = async (body: LoginBody) => {
  try {
    // server component form validation
    loginSchema.parse(body)

    const { email, password } = body

    // compare passwords
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email
      }
    })
    const isPasswordTrue = await bcrypt.compare(password, user.password)
    if(!isPasswordTrue) {
      throw new Error('invalid email or password')
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
    return {
      ok: true,
      user: {
        ...user,
        password: undefined,
      }
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}

export default loginServerAction