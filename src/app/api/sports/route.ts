import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sports = await prisma.sport.findMany()

    return NextResponse.json(sports)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch sports' }, { status: 500 })
  }
}
