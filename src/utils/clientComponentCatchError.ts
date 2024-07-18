import toast from "react-hot-toast"
import { ZodError } from "zod"

const clientComponentCatchError = (err: unknown) => {
  if (err instanceof Error) {
    // zod errors
    if (err instanceof ZodError) {
      toast.error(`${err.errors[0].path[0]}: ${err.errors[0].message}`)
      return
    }

    // general Error message
    toast.error(err.message)

  } else {
    // errors without messages
    toast.error(err as string)
  }
}

export default clientComponentCatchError