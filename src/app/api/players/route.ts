// app/api/players/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { Player } from '@/types'
import { API_BASE_URL, API_TOKEN } from '@/lib/constant'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const ids = searchParams.get('ids')

  if (!ids) {
    return NextResponse.json({ error: 'Missing "ids" parameter' }, { status: 400 })
  }

  const playerIds = ids.split(',').map(Number)

  try {
    const players: Player[] = await Promise.all(
      playerIds.map(async (id) => {
        const { data } = await axios.get(`${API_BASE_URL}/persons/${id}`, {
          headers: { 'X-Auth-Token': API_TOKEN || '' },
        })

        console.log('API request params:', ids, 'Response data:', data)

        return {
          id: data.id,
          name: data.name,
          position: data.position || 'Unknown',
          league: data.currentTeam?.runningCompetitions?.[0]?.name || 'Unknown',
          team: data.currentTeam?.name || 'Unknown', 
          goals: 0,
          assists: 0,
          appearances: 0,
          image: data.currentTeam?.crest || '',
          leagueBadge: data.currentTeam?.runningCompetitions?.[0]?.code || 'N/A',
        }
      })
    )

    return NextResponse.json(players)
  } catch (error: any) {
    console.error('Failed to fetch players:', error.message)
    return NextResponse.json({ error: 'Failed to fetch player data' }, { status: 500 })
  }
}



