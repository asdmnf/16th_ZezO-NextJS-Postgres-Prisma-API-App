import { NextResponse } from "next/server"
import customRegexError from "./customRegexError"

const catchError = (err: unknown) => {
  if(err instanceof Error) {
    // mainly for findUniqueOrThrow errors
    if (err.name === 'NotFoundError') {
      return NextResponse.json({
        message: err.message
      }, {
        status: 404
      })
    }

    // mainly for request body syntax error
    if (err.name === 'SyntaxError') {
      return NextResponse.json({
        message: err.message
      }, {
        status: 400
      })
    }

    // mainly for api features errors with not found arguments
    if (err.message.includes('Unknown argument')) {
      const error = customRegexError({
        errorMessage: err.message,
        regularExpression: /Unknown argument `\s*(.*?)\s*`/,
        unmatchedMessage: 'one or more arguments you provided not found, please check your argument name and make sure that it does not have spaces'
      })
      return error
    }

    // mainly for api features errors with invalid argument value or type such as if received string and expected int
    if (err.message.includes('Invalid value provided')) {
      const error = customRegexError({
        errorMessage: err.message,
        regularExpression: /Argument `\s*(.*?)\s*`: Invalid value provided/,
        unmatchedMessage: 'one or more arguments you provided not valid, please check your argument value or type'
      })
      return error
    }

    // mainly for api features errors with invalid argument value or type such as if send an string to date argument like createdAt
    if (err.message.includes('Invalid value for argument')) {
      const error = customRegexError({
        errorMessage: err.message,
        regularExpression: /Invalid value for argument `\s*(.*?)\s*`/,
        unmatchedMessage: 'one or more arguments you provided not valid, please check your argument value or type'
      })
      return error
    }

    // mainly for api features errors with invalid select field
    if (err.message.includes('Unknown field')) {
      const error = customRegexError({
        errorMessage: err.message,
        regularExpression: /Unknown field `\s*(.*?)\s*`/,
        unmatchedMessage: 'one or more select fields you provided not found, please check your select field value'
      })
      return error
    }

    // mainly for select api feature while selecting password
    if (err.message === 'you cannot use password field') {
      return NextResponse.json({
        message: err.message
      }, {
        status: 400
      })
    }

    // mainly for select api feature while selecting user
    if (err.message === 'you cannot use user field') {
      return NextResponse.json({
        message: err.message
      }, {
        status: 400
      })
    }

    // mainly while deleteing user that have articles or comments
    if ((err as any).code === 'P2003') {
      return NextResponse.json({
        message: 'delete account that have related records is not avialable right now'
      }, {
        status: 400
      })
    }

    // other errors
    console.log(err)
    return NextResponse.json({
      message: process.env.NODE_ENV === 'development' ? err.message : 'internal server error'
    }, {
      status: 500
    })
  } else {
    console.log(err)
    return NextResponse.json({
      message: process.env.NODE_ENV === 'development' ? err : 'internal server error'
    }, {
      status: 500
    })
  }
}

export default catchError