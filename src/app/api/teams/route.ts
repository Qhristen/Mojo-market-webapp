import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const teamSchema = z.object({
  name: z.string().min(2),
  sportId: z.string().uuid(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = teamSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { name, sportId } = parsed.data
    const avatar = `https://ui-avatars.com/api/?name=${name}+${name}&background=random&rounded=true&size=128`

    const team = await prisma.team.create({
      data: {
        name,
        sportId,
        avatar,
      },
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: { sport: true, players: true },
    })
    return NextResponse.json(teams)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}
