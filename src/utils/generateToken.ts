import jwt from 'jsonwebtoken'

const generateToken = (userID: number) => {
  const token = jwt.sign(
    {userID},
    process.env.JWT_SECRET_KEY as string,
    {expiresIn: process.env.JWT_EXPIRES_IN}
  )
  return token
}

export default generateToken