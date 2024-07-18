'use server'

import bcrypt from "bcryptjs";
import prisma from "@/utils/PrismaClient"
import serverActionCatchError from "@/utils/serverActionCatchError"
import updateCurrentUserSchema, { UpdateCurrentUserBody } from "@/validation/updateCurrentUserSchema"
import { revalidatePath } from "next/cache";
import { UpdateProfileUserData } from "@/utils/typescript/types";

const updateUserServerAction = async (userData: UpdateProfileUserData, body: UpdateCurrentUserBody) => {
  try {
    // server component form validation
    updateCurrentUserSchema.parse(body)

    // check if updated email is already exists in db
    if (body.email) {
      const userRecord = await prisma.user.findUnique({
        where: {
          email: body.email
        }
      })
      if (userRecord) {
        if (userData.email === body.email) {
          throw new Error('provided email is already your email address')
        }
        throw new Error('email is already exists')
      }
    }

    // check if user want to update password
    let hashedPassword = undefined
    if (body.password) {
      // password hashing
      hashedPassword = await bcrypt.hash(body.password, 12)
    }

    // update user
    const updatedUser = await prisma.user.update({
      where: {
        id: userData.id
      },
      data: {
        ...body,
        password: hashedPassword
      }
    })

    revalidatePath('/profile')

    // return updated user
    return {
      ok: true,
      user: {
        ...updatedUser,
        password: undefined
      }
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}

export default updateUserServerAction