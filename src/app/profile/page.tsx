import jwt, { JwtPayload } from 'jsonwebtoken'
import UpdateProfileForm from "@/components/forms/UpdateProfileForm"
import { cookies } from 'next/headers';
import prisma from '@/utils/PrismaClient';
import { UpdateProfileUserData } from '@/utils/typescript/types';

const page = async () => {

  const token = cookies().get("token");
  const isLogged = !!token?.value;

  // TODO: create getUserFromToken and apply it here
  // get user name
  let userData
  if (isLogged) {
    // 2- verify token
    const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET_KEY as string) as JwtPayload
    
    // 3- verify user still exists
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userID
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    userData = user
  }

  return (
    <div className="flex justify-center mt-32">
      <div className="max-w-md w-full space-y-8">
        <UpdateProfileForm userData={userData as UpdateProfileUserData} />
      </div>
    </div>
  )
}

export default page