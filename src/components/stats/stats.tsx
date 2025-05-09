'use client'

import React from 'react'
import { usePlayer } from './player-data-access'

const PLAYER_IDS = 44

export default function StatsComponent() {
  const { data: player, isLoading, isError } = usePlayer(PLAYER_IDS)

  if (isLoading) return <div>Loading player stats...</div>
  if (isError) return <div>Error loading player stats.</div>

  return (
    <div className="space-y-4">
      <div key={player?.id} className="p-4 border rounded">
        <h3 className="text-xl font-bold">{player?.name}</h3>
        <p>Position: {player?.position}</p>
      </div>
    </div>
  )
}
