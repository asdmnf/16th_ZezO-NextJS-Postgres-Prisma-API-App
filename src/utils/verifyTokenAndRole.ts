import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from './PrismaClient'
import { NextRequest} from 'next/server'
import { cookies } from 'next/headers'
import { Role } from './typescript/enums'

const verifyTokenAndRole = async (request: NextRequest, roles?: Role[]) => {
    try {
      // 1- get token from authorization or from cookies
      let token
  
    if (request.headers && request.headers.get('authorization')?.startsWith("Bearer")) {
      token = request.headers.get('authorization')?.split(" ")[1]
    } else {
      token = cookies().get('token')?.value
    }
  
    if (!token) {
      return {
        user: null,
        token: null,
        error: 'you are not logged in, please login and try again',
        status: 401
      }
    }
    
      // 2- verify token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload
    
      // 3- verify user still exists
      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.userID
        }
      })
    
      if (!user) {
        return {
          user: null,
          token: null,
          error: 'your user account is not exists any more please signup again',
          status: 404
        }
      }

      // 4- check role
      if (roles?.length && !roles.includes(user.role as Role)) {
        return {
          user: null,
          token: null,
          error: 'you are not allowed to perform this action',
          status: 403
        }
      }
    
      // 5- return user record
      return {
        user,
        token,
        error: null,
        status: null
      }
    } catch (err) {
      // expired token error
      if (err instanceof jwt.TokenExpiredError) {
        return {
          user: null,
          token: null,
          error: 'expired token, please login and try again',
          status: 401
        }
      }

      // invalid token error
      if (err instanceof jwt.JsonWebTokenError) {
        return {
          user: null,
          token: null,
          error: 'invalid token, please login and try again',
          status: 401
        }
      }
    }
}

export default verifyTokenAndRole