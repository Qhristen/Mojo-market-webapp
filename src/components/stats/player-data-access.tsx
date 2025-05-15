// // File: player-data-access.ts

// import { Player } from '@/types'
// import { useQuery } from '@tanstack/react-query'

// export function usePlayer(id?: number) {
//   return useQuery({
//     queryKey: ['player', { id }],
//     queryFn: async () => {
//       if (!id) return null

//       const response = await fetch(`/api/player?id=${id}`)

//       if (!response.ok) {
//         console.error(`Failed to fetch player ${id}:`, response.statusText)
//         return null
//       }

//       const data = await response.json()

//       return {
//         id: data.id,
//         name: data.name,
//         position: data.position || 'Unknown',
//         league: data.currentTeam?.runningCompetitions?.[0]?.name || 'Unknown',
//         team: data.currentTeam?.name || 'Unknown',
//         goals: 0,
//         assists: 0,
//         appearances: 0,
//         image: data.currentTeam?.crest || '',
//         leagueBadge: data.currentTeam?.runningCompetitions?.[0]?.code || 'N/A',
//       } as Player
//     },
//     enabled: !!id,
//     staleTime: 1000 * 60 * 5,
//     retry: 2,
//   })
// }

import { API_BASE_URL, API_TOKEN } from '@/lib/constant'
import { Player } from '@/types'
import { useQuery, useQueries } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Fetches a single player by ID directly from the football-data.org API
 */
export function usePlayer(id?: number) {
  return useQuery({
    queryKey: ['player', { id }],
    queryFn: async () => {
      if (!id) return null

      const response = await fetch(`${API_BASE_URL}/competitions/`, {
        headers: {
          'X-Auth-Token': API_TOKEN || '',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        console.error(`Failed to fetch player ${id}:`, response.statusText)
        return null
      }

      const data = await response.json()

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
      } as Player
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })
}

/**
 * Fetches multiple players by their IDs (using individual requests)
 */
export function usePlayers(playerIds: number[]) {
  return useQuery({
    queryKey: ['players', { ids: playerIds }],
    queryFn: async () => {
      if (!playerIds.length) return []

      const players = await Promise.all(
        playerIds.map(async (id) => {
          try {
            const { data } = await axios.get(`${API_BASE_URL}/persons/${id}`, {
              headers: { 'X-Auth-Token': API_TOKEN || '' },
            })

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
            } as Player
          } catch (error) {
            console.error(`Failed to fetch player ${id}:`, error)
            return null
          }
        }),
      )

      return players.filter(Boolean) as Player[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: playerIds.length > 0,
    retry: 2,
    initialData: [],
  })
}

/**
 * Hook to fetch multiple players individually (useful when you need separate loading states)
 */
export function useMultiplePlayers(playerIds: number[]) {
  return useQueries({
    queries: playerIds.map((id) => ({
      queryKey: ['player', { id }],
      queryFn: async () => {
        const { data } = await axios.get(`${API_BASE_URL}/persons/${id}`, {
          headers: { 'X-Auth-Token': API_TOKEN || '' },
        })

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
        } as Player
      },
      staleTime: 1000 * 60 * 5,
      enabled: !!id,
      retry: 2,
    })),
  })
}

/**
 * Hook to search for players by name
 * Uses the Search API endpoint from football-data.org
 */
export function useSearchPlayers(searchTerm: string) {
  return useQuery({
    queryKey: ['search-players', { term: searchTerm }],
    queryFn: async () => {
      try {
        // Note: You'll need to verify if football-data.org has a player search endpoint
        // This is an example implementation
        const { data } = await axios.get(`${API_BASE_URL}/persons`, {
          headers: { 'X-Auth-Token': API_TOKEN || '' },
          params: { name: searchTerm },
        })

        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          position: item.position || 'Unknown',
          league: item.currentTeam?.runningCompetitions?.[0]?.name || 'Unknown',
          team: item.currentTeam?.name || 'Unknown',
          goals: 0,
          assists: 0,
          appearances: 0,
          image: item.currentTeam?.crest || '',
          leagueBadge: item.currentTeam?.runningCompetitions?.[0]?.code || 'N/A',
        })) as Player[]
      } catch (error) {
        console.error('Error searching players:', error)
        throw new Error('Failed to search players')
      }
    },
    enabled: searchTerm.length > 2,
    staleTime: 1000 * 60 * 5,
  })
}
