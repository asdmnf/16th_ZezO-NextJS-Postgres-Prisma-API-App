import { NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

const applyValidationSchema = (schema: ZodSchema, body: unknown) => {
  try {
    schema.parse(body)
    return NextResponse.next()
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({
        message: err.formErrors
      }, {
        status: 400
      })
    }
  }
}

export default applyValidationSchema