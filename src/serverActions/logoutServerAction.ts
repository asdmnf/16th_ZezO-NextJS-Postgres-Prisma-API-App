'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const logoutServerAction = () => {
  // remove token cookie
  cookies().delete('token')

  // redirect to home page
  redirect('/')
}

export default logoutServerAction