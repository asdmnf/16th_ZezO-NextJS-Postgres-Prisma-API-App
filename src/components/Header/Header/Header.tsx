import jwt, { JwtPayload } from 'jsonwebtoken'
import logoutServerAction from "@/serverActions/logoutServerAction";
import prisma from "@/utils/PrismaClient";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from 'next/image';

const Header = async () => {
  const token = cookies().get("token");
  const isLogged = !!token?.value;

  // control elements
  const hideElementOnLogout = !isLogged && 'hidden'
  const hideElementOnLogin = isLogged && 'hidden'

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
        name: true
      }
    })

    userData = user
  }

  return (
    <header className="h-[60px] bg-gray-700 text-white py-4 flex justify-center items-center">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-gray-400">
            Home
          </Link>
          <Link href="/dashboard" className={`text-white hover:text-gray-400 ${hideElementOnLogout}`}>
            Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/register"
            className={`px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 hover:text-white ${hideElementOnLogin}`}
          >
            Register
          </Link>
          <Link
            href="/login"
            className={`px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 hover:text-white ${hideElementOnLogin}`}
          >
            Login
          </Link>
          
          <Link href='/profile' className={`flex items-center space-x-2 ${hideElementOnLogout}`}>
            <Image className="rounded-full" src="https://semantic-ui.com/images/avatar2/large/matthew.png" alt="user avatar" width={40} height={40} />
            <p className="text-gray-400 font-bold">{userData?.name.split(' ')[0]}</p>
          </Link>

          
          <form action=''>
            <button
              className={`px-4 py-2 bg-red-500 rounded hover:bg-red-600 text-white border-0 cursor-pointer ${hideElementOnLogout}`}
              formAction={logoutServerAction}
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;
