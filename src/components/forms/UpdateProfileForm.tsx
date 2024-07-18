'use client'

import updateUserServerAction from "@/serverActions/updateUserServerAction";
import FormButton from "./FormButton";
import clientComponentCatchError from "@/utils/clientComponentCatchError";
import updateCurrentUserSchema, { UpdateCurrentUserBody } from "@/validation/updateCurrentUserSchema";
import toast from "react-hot-toast";
import { UpdateProfileUserData, UserResponse } from "@/utils/typescript/types";

const UpdateProfileForm = ({userData}: {userData: UpdateProfileUserData}) => {

  const updateUserHandler = async (formData: FormData) => {
    try {
      // get body
      const name = formData.get('name')
      const email = formData.get('email')
      const password = formData.get('password')

      if (name === userData?.name && email === userData?.email && !password) {
        throw new Error('do change first')
      }

      // create body object
      const body = {
        name: name === userData?.name ? undefined : name,
        email: email === userData?.email ? undefined : email,
        password: !password ? undefined : password,
      } as UpdateCurrentUserBody

      // client component form validation
      updateCurrentUserSchema.parse(body)

      // get response from server action and show toasts
      const res = await updateUserServerAction(userData, body) as UserResponse

      // throw error on fail
      if (!res?.ok) {
        throw new Error(res.error)
      }

      // show success toast on success
      if (res?.ok) {
        toast.success('user updated successfully')
      }
    } catch (err) {
      clientComponentCatchError(err)
    }
  }

  return (
    <form
      className="bg-white shadow-lg rounded px-12 pt-6 pb-8 mb-4"
      action={updateUserHandler}
    >
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
            defaultValue={userData?.name || ''}
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
            defaultValue={userData?.email || ''}
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
        <FormButton BtnName="Update" />
      </div>
    </form>
  );
};

export default UpdateProfileForm;
