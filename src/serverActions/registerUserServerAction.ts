'use server'


import bcrypt from "bcryptjs";
import prisma from "@/utils/PrismaClient"
import registerSchema, { RegisterUserBody } from "@/validation/registerSchema"
import serverActionCatchError from "@/utils/serverActionCatchError";


const registerUserServerAction = async (body: RegisterUserBody) => {

  try {
    registerSchema.parse(body)
  
    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email
      }
    })
    if (existingUser) {
      throw new Error('user already exists')
    }
  
    // password hashing
    const hashedPassword = await bcrypt.hash(body.password, 12)
  
    // register user
    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword
      }
    })

    // return user
    return {
      ok: true,
      user: {
        ...user,
        password: undefined
      }
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}

export default registerUserServerAction