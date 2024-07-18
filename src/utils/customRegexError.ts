import { NextResponse } from "next/server";
import { CustomRegexErrorProps } from "./typescript/types";

const customRegexError = ({regularExpression, errorMessage, unmatchedMessage}: CustomRegexErrorProps) => {
  const message = errorMessage
  const regex = regularExpression
  const match = message.match(regex);
  if (match) {
    return NextResponse.json({
      message: match[0]
    }, {
      status: 400
    })
  } else {
    return NextResponse.json({
      message: unmatchedMessage
    }, {
      status: 400
    })
  }
}

export default customRegexError