"use client";

import Link from "next/link";
import FormButton from "./FormButton";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import loginSchema, { LoginBody } from "@/validation/loginSchema";
import toast from "react-hot-toast";
import clientComponentCatchError from "@/utils/clientComponentCatchError";
import loginServerAction from "@/serverActions/loginServerAction";
import { UserResponse } from "@/utils/typescript/types";

const LoginForm = () => {

  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const loginHandler = async (formData: FormData) => {
    try {
      const email = formData.get('email')
      const password = formData.get('password')
  
      // create body object
      const body = {
        email,
        password
      } as LoginBody
  
      // client component form validation
      loginSchema.parse(body)
    
      // get response from server action and show toasts
      const res = await loginServerAction(body) as UserResponse
  
      // throw error on fail
      if (!res?.ok) {
        throw new Error(res.error)
      }
  
      // show success toast on success
      if (res?.ok) {
        toast.success('welcome back!')
  
        // reset form data
        formRef.current?.reset()
  
        // redirect to home page
        router.replace('/')
      }
    } catch (err) {
      clientComponentCatchError(err)
    }
  }

  return (
    <form className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4" action={loginHandler} ref={formRef}>
      <div className="space-y-4">
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
      </div>

      <div className="flex items-center justify-between mt-5">
        <FormButton BtnName="Login" />
      </div>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don&apos;t have an account? {' '}
        <Link href="/register" className="text-blue-500 hover:underline">Create Account</Link>
      </p>
    </form>
  );
};

export default LoginForm;
