import { ZodError } from "zod"

const serverActionCatchError = (err: unknown) => {
  if(err instanceof Error) {
    // zod errors
    if (err instanceof ZodError) {
      return {
        ok: false,
        error: `${err.errors[0].path[0]}: ${err.errors[0].message}`
      }
    }

    if (err.name === 'NotFoundError') {
      return {
        ok: false,
        error: err.message
      }
    }

    // mainly for request body syntax error
    if (err.name === 'SyntaxError') {
      return {
        ok: false,
        error: err.message
      }
    }

    // mainly for prisma not found arguments
    if (err.message.includes('Unknown argument')) {
      const regex = /Unknown argument `\s*(.*?)\s*`/
      const message = err.message
      const match = message.match(regex)
      const error = match ? match[0] : null;
      return {
        ok: false,
        error
      }
    }

    // mainly for prisma invalid argument value or type such as if received string and expected int
    if (err.message.includes('Invalid value provided')) {
      const regex = /Argument `\s*(.*?)\s*`: Invalid value provided/
      const message = err.message
      const match = message.match(regex)
      const error = match ? match[0] : null;
      return {
        ok: false,
        error
      }
    }

    // mainly for prisma invalid argument value or type such as if send an string to date argument like createdAt
    if (err.message.includes('Invalid value for argument')) {
      const regex = /Invalid value for argument `\s*(.*?)\s*`/
      const message = err.message
      const match = message.match(regex)
      const error = match ? match[0] : null;
      return {
        ok: false,
        error
      }
    }

    // general Error message
    console.log(err.message)
    return {
      ok: false,
      error: err.message
    }
  }

  // errors without messages
  console.log(err)
  return {
    ok: false,
    error: err
  }
}

export default serverActionCatchError