'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import { Player } from '@/types'
import PlayerCard from './player-card'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

// TypeScript Interfaces

interface LeagueOption {
  id: string
  name: string
}

interface SortOption {
  value: string
  label: string
}

type LeagueBadgeColors = {
  [key: string]: string
}

// Sample player data
const playerData: Player[] = [
    {
        id: 1,
        name: 'Erling Haaland',
        position: 'Striker',
        league: 'Premier League',
        team: 'Manchester City',
        goals: 36,
        assists: 8,
        appearances: 35,
        image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png',
        leagueBadge: 'PL',
    },
    {
        id: 2,
        name: 'Vinícius Júnior',
        position: 'Winger',
        league: 'La Liga',
        team: 'Real Madrid',
        goals: 21,
        assists: 19,
        appearances: 37,
        image: 'https://www.realmadrid.com/img/vertical_380px/vinicius_380x501_20230810055550.jpg',
        leagueBadge: 'LL',
    },
    {
        id: 3,
        name: 'Harry Kane',
        position: 'Striker',
        league: 'Bundesliga',
        team: 'Bayern Munich',
        goals: 32,
        assists: 10,
        appearances: 33,
        image: 'https://img.fcbayern.com/image/upload/t_cms-1x1-seo/v1692344059/cms/public/images/fcbayern-com/players/season-23-24/kane.png',
        leagueBadge: 'BL',
    },
    {
        id: 4,
        name: 'Mohamed Salah',
        position: 'Winger',
        league: 'Premier League',
        team: 'Liverpool',
        goals: 24,
        assists: 16,
        appearances: 38,
        image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png',
        leagueBadge: 'PL',
    },
    {
        id: 5,
        name: 'Jude Bellingham',
        position: 'Midfielder',
        league: 'La Liga',
        team: 'Real Madrid',
        goals: 19,
        assists: 9,
        appearances: 34,
        image: 'https://www.realmadrid.com/img/vertical_380px/bellingham_380x501_20230615055338.jpg',
        leagueBadge: 'LL',
    },
    {
        id: 6,
        name: 'Victor Osimhen',
        position: 'Striker',
        league: 'Serie A',
        team: 'Napoli',
        goals: 26,
        assists: 5,
        appearances: 32,
        image: 'https://img.sscnapoli.it/Foto/GetFoto?name=Osimhen&type=PNG',
        leagueBadge: 'SA',
    },
    {
        id: 7,
        name: 'Phil Foden',
        position: 'Midfielder',
        league: 'Premier League',
        team: 'Manchester City',
        goals: 15,
        assists: 11,
        appearances: 36,
        image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p209244.png',
        leagueBadge: 'PL',
    },
    {
        id: 8,
        name: 'Kylian Mbappé',
        position: 'Forward',
        league: 'La Liga',
        team: 'Real Madrid',
        goals: 28,
        assists: 17,
        appearances: 34,
        image: 'https://www.psg.fr/img/photos/playersheet/2023-24/first-team/750x750_nophoto.png',
        leagueBadge: 'LL',
    },
    {
        id: 9,
        name: 'Florian Wirtz',
        position: 'Attacking Midfielder',
        league: 'Bundesliga',
        team: 'Bayer Leverkusen',
        goals: 14,
        assists: 22,
        appearances: 37,
        image: 'https://assets.bundesliga.com/player/image/dfl-obj-002y4v-dfl-clu-000005-dfl-sea-0001k6.png',
        leagueBadge: 'BL',
    },
    {
        id: 10,
        name: 'Lautaro Martinez',
        position: 'Striker',
        league: 'Serie A',
        team: 'Inter Milan',
        goals: 29,
        assists: 4,
        appearances: 38,
        image: 'https://www.inter.it/img/players/first-team/YFT9NH_1695118159318_players.png',
        leagueBadge: 'SA',
    },
    {
        id: 11,
        name: 'Bruno Fernandes',
        position: 'Midfielder',
        league: 'Premier League',
        team: 'Manchester United',
        goals: 12,
        assists: 14,
        appearances: 37,
        image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p141746.png',
        leagueBadge: 'PL',
    },
    {
        id: 12,
        name: 'Robert Lewandowski',
        position: 'Striker',
        league: 'La Liga',
        team: 'Barcelona',
        goals: 25,
        assists: 8,
        appearances: 36,
        image: 'https://www.fcbarcelona.com/photo-resources/2023/09/20/ae5188d8-67fd-4229-9544-801a16a02091/09-ROBERT_LEWANDOWSKI.jpg',
        leagueBadge: 'LL',
    },
]

// League badge colors
const leagueBadgeColors: LeagueBadgeColors = {
  PL: 'bg-blue-600',
  LL: 'bg-orange-500',
  BL: 'bg-red-600',
  SA: 'bg-green-700',
}

// League names for filter dropdown
const leagues: LeagueOption[] = [
  { id: 'all', name: 'All Leagues' },
  { id: 'Premier League', name: 'Premier League' },
  { id: 'La Liga', name: 'La Liga' },
  { id: 'Bundesliga', name: 'Bundesliga' },
  { id: 'Serie A', name: 'Serie A' },
]

// Available sort options
const sortOptions: SortOption[] = [
  { value: 'goals-desc', label: 'Most Goals' },
  { value: 'assists-desc', label: 'Most Assists' },
  { value: 'appearances-desc', label: 'Most Appearances' },
  { value: 'name-asc', label: 'Name (A-Z)' },
]

// Main Dashboard Component
const Stats: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(playerData)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedLeague, setSelectedLeague] = useState<string>('all')
  const [sortOption, setSortOption] = useState<string>('goals-desc')

  // Filter and sort players based on search, league filter, and sort option
  useEffect(() => {
    let filteredPlayers = [...playerData]

    // Apply league filter
    if (selectedLeague !== 'all') {
      filteredPlayers = filteredPlayers.filter((player) => player.league === selectedLeague)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredPlayers = filteredPlayers.filter(
        (player) => player.name.toLowerCase().includes(query) || player.team.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    const [sortField, sortDirection] = sortOption.split('-')
    filteredPlayers.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else {
        return sortDirection === 'asc'
          ? (a[sortField as keyof Player] as number) - (b[sortField as keyof Player] as number)
          : (b[sortField as keyof Player] as number) - (a[sortField as keyof Player] as number)
      }
    })

    setPlayers(filteredPlayers)
  }, [searchQuery, selectedLeague, sortOption])

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <Card className="bg-primary-mojo py-8 px-6 mb-2 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-jersey15 mb-2">Player Statistics</h1>
          <p className="text-blue-100">Browse and compare stats from top players across major leagues</p>
        </div>
      </Card>

      {/* Filter and Search Bar */}
      <Card className="max-w-7xl mx-auto px-4 py-6 sticky top-0 z-10 shadow-sm rounded-b-lg">
        <div className="md:flex justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-1 md:mr-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <Search size={18} />
              </div>
              <Input
                type="text"
                className="w-full pl-10 pr-4 py-2"
                placeholder="Search players or teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="w-40">
              <Select onValueChange={(e) => setSelectedLeague(e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Leagues" />
                </SelectTrigger>
                <SelectContent>
                  {leagues.map((league, i) => (
                    <SelectItem key={i} value={league.name}> {league.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-40">
              <Select onValueChange={(e) => setSortOption(e)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option, i) => (
                    <SelectItem key={i} value={option.value}> {option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Player Grid */}
      <div className="max-w-7xl mx-auto py-8">
        {players.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No players match your filters</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stats
