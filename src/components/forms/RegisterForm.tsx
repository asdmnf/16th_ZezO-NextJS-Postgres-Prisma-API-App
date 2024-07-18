'use client'

import registerUserServerAction from "@/serverActions/registerUserServerAction"
import clientComponentCatchError from "@/utils/clientComponentCatchError"
import { UserResponse } from "@/utils/typescript/types"
import registerSchema, { RegisterUserBody } from "@/validation/registerSchema"
import toast from "react-hot-toast"
import FormButton from "./FormButton"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import Link from "next/link"

const RegisterForm = () => {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const registerUserHandler = async (formData: FormData) => {
    try {
      // get body
      const name = formData.get('name')
      const email = formData.get('email')
      const password = formData.get('password')
      const passwordConfirmation = formData.get('passwordConfirmation')
  
      // check password and passwordConfirmation
      if (password !== passwordConfirmation) {
        throw new Error('passwords not match')
      }

      // create body object
      const body = {
        name,
        email,
        password,
      } as RegisterUserBody
  
      // client component form validation
      registerSchema.parse(body)
  
      // get response from server action and show toasts
      const res = await registerUserServerAction(body) as UserResponse

      // throw error on fail
      if (!res?.ok) {
        throw new Error(res.error)
      }

      // show success toast on success
      if (res?.ok) {
        toast.success('user created successfully')
        formRef.current?.reset()

        // redirect to login page
        router.replace('/login')
      }

    } catch (err) {
      clientComponentCatchError(err)
    }
  }

  return (
    <form className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4" action={registerUserHandler} ref={formRef}>
          <div className="space-y-4">
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                name="name"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="passwordConfirmation"
              >
                Password Confirmation
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="passwordConfirmation"
                name="passwordConfirmation"
                type="password"
                placeholder="Password Confirmation"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-5">
            <FormButton BtnName="Register" />
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? {' '}
            <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>
        </form>
  )
}

export default RegisterForm