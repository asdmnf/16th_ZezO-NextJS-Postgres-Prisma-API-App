import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from './utils/PrismaClient';

export async function middleware(request: NextRequest) {
  return NextResponse.next()
}