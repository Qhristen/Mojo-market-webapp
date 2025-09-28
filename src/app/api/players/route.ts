import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Validation schema
const playerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  position: z.string().optional(),
  number: z.number().int().positive().optional(),
  teamId: z.string().uuid().optional(),
  sportId: z.string().uuid(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const parsed = playerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, position, number, teamId, sportId } = parsed.data
  const avatar = `https://ui-avatars.com/api/?name=${name}+${number}&background=random&rounded=true&size=128`

    // Create player
    const player = await prisma.player.create({
      data: {
        name,
        position: position ?? '', 
        avatar,
        sportId,
        teamId,
      },
    })

    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      include: { team: true, sport: true },
    })

    return NextResponse.json(players)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}
