import { Player } from '@/types'
import { useQuery, useQueries, UseQueryResult } from '@tanstack/react-query'
import axios from 'axios'

/**
 * Fetches a single player by ID through your API route
 * (which proxies requests to football-data.org to avoid CORS issues)
 */
export async function fetchPlayerById(id: number): Promise<Player | null> {
  try {
    const response = await axios.get('/api/players', {
      params: {
        ids: id.toString(),
      },
    })

    const players = response.data as Player[]
    return players.length > 0 ? players[0] : null
  } catch (error) {
    console.error(`Failed to fetch player ${id}:`, error)
    throw new Error(`Failed to fetch player ${id}`)
  }
}

/**
 * Fetches multiple players by their IDs through your API route
 * (Uses a single request to fetch all players)
 */
export async function fetchMultiplePlayers(ids: number[]): Promise<Player[]> {
  if (!ids.length) return []

  try {
    const response = await axios.get('/api/players', {
      params: {
        ids: ids.join(','),
      },
    })

    return response.data as Player[]
  } catch (error) {
    console.error('Error fetching players:', error)
    throw new Error('Failed to fetch players')
  }
}

/**
 * Hook to fetch a single player
 */
export function usePlayer(id?: number) {
  return useQuery<Player | null>({
    queryKey: ['player', id],
    queryFn: () => fetchPlayerById(id as number),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  })
}

/**
 * Hook to fetch multiple players at once
 */
export function usePlayers(playerIds: number[]) {
  return useQuery<Player[]>({
    queryKey: ['players', playerIds],
    queryFn: () => fetchMultiplePlayers(playerIds),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: playerIds.length > 0,
    retry: 2,
    initialData: [],
  })
}

/**
 * Hook to fetch multiple players individually (useful when you need separate loading states)
 */
export function useMultiplePlayers(playerIds: number[]): UseQueryResult<Player | null, Error>[] {
  return useQueries({
    queries: playerIds.map((id) => ({
      queryKey: ['player', id],
      queryFn: () => fetchPlayerById(id),
      staleTime: 1000 * 60 * 5,
      enabled: !!id,
      retry: 2,
    })),
  })
}

/**
 * Hook to search for players by name
 * Requires implementing a search endpoint in your API
 */
export function useSearchPlayers(searchTerm: string) {
  return useQuery({
    queryKey: ['search-players', searchTerm],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/search-players', {
          params: { q: searchTerm },
        })
        return response.data as Player[]
      } catch (error) {
        console.error('Error searching players:', error)
        throw new Error('Failed to search players')
      }
    },
    enabled: searchTerm.length > 2,
    staleTime: 1000 * 60 * 5,
  })
}
