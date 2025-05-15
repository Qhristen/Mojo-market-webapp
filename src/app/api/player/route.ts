// File: app/api/player/route.ts

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_URL = 'https://api.football-data.org/v4/players'
const API_TOKEN = process.env.API_TOKEN

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Player ID is required' }, { status: 400 })
  }

  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        'X-Auth-Token': API_TOKEN || '',
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message)
    return NextResponse.json(
      {
        error: 'Failed to fetch player data from external API',
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    )
  }
}
