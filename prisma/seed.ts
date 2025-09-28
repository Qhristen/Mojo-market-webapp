import { PrismaClient, Sport, StatType } from '@/generated/prisma'

const prisma = new PrismaClient()
async function main() {
  console.log('🌱 Seeding database...')

  // ---------------------
  // USERS
  // ---------------------
  const avatar = `https://ui-avatars.com/api/?name=U+S&background=random&rounded=true&size=128`

  const users = await prisma.user.createMany({
    data: [
      {
        email: 'john@example.com',
        username: 'john',
        avatar,
        walletAddress: 'HLWr8VZ6rxLdfEvNrvGDLxv71YRntgCrmM5VD1gBkoPf',
      },
      {
        email: 'sarah@example.com',
        username: 'sarah',
        avatar: '',
        walletAddress: '3KcnXCoTi9KQTbjKUJxaoP965k9vcoQd2hSgQtMg8ZGA',
      },
    ],
    skipDuplicates: true,
  })

  // SPORTS
  const football = await prisma.sport.create({ data: { name: 'Football' } })
  const basketball = await prisma.sport.create({ data: { name: 'Basketball' } })
  const volleyball = await prisma.sport.create({ data: { name: 'Volleyball' } })

  // ---------------------
  // LEAGUES
  // ---------------------
  const footballLeague = await prisma.league.create({
    data: { name: 'Premier League', sportId: football.id },
  })

  const basketballLeague = await prisma.league.create({
    data: { name: 'NBA', sportId: basketball.id },
  })

  const volleyballLeague = await prisma.league.create({
    data: { name: 'FIVB World League', sportId: volleyball.id }, // reuse enum TENNIS -> Volleyball if you want another Sport type
  })

  // ---------------------
  // TEAMS + PLAYERS
  // ---------------------
  const footballTeams = await prisma.team.createMany({
    data: [
      { name: 'Manchester United', avatar, sportId: football.id },
      { name: 'Real Madrid', avatar, sportId: football.id },
    ],
    skipDuplicates: true,
  })

  const basketballTeams = await prisma.team.createMany({
    data: [
      { name: 'Los Angeles Lakers', avatar, sportId: basketball.id },
      { name: 'Golden State Warriors', avatar, sportId: basketball.id },
    ],
    skipDuplicates: true,
  })

  const volleyballTeams = await prisma.team.createMany({
    data: [
      { name: 'Brazil National Team', avatar,  sportId: volleyball.id },
      { name: 'USA National Team', avatar,  sportId: volleyball.id },
    ],
    skipDuplicates: true,
  })

  // ---------------------
  // PLAYERS (Top 20 each sport)
  // ---------------------
  const footballPlayers = [
    'Lionel Messi',
    'Cristiano Ronaldo',
    'Kylian Mbappé',
    'Erling Haaland',
    'Neymar Jr',
    'Kevin De Bruyne',
    'Mohamed Salah',
    'Luka Modrić',
    'Karim Benzema',
    'Robert Lewandowski',
    'Harry Kane',
    'Virgil van Dijk',
    'Bruno Fernandes',
    'Sadio Mané',
    'Antoine Griezmann',
    'Phil Foden',
    'Vinícius Júnior',
    'Pedri',
    'Frenkie de Jong',
    'Gavi',
  ]

  const basketballPlayers = [
    'LeBron James',
    'Stephen Curry',
    'Kevin Durant',
    'Giannis Antetokounmpo',
    'Luka Dončić',
    'Nikola Jokić',
    'Joel Embiid',
    'Anthony Davis',
    'Kawhi Leonard',
    'Jimmy Butler',
    'Ja Morant',
    'Jayson Tatum',
    'Kyrie Irving',
    'Paul George',
    'James Harden',
    'Damian Lillard',
    'Zion Williamson',
    'Devin Booker',
    'Trae Young',
    'Donovan Mitchell',
  ]

  const volleyballPlayers = [
    'Wilfredo León',
    "Earvin N'Gapeth",
    'Ivan Zaytsev',
    'Maxim Mikhaylov',
    'Matey Kaziyski',
    'Bruno Rezende',
    'Matthew Anderson',
    'Sérgio Santos',
    'Saeid Marouf',
    'Micah Christenson',
    'Tsvetan Sokolov',
    'Robertlandy Simón',
    'Yoandy Leal',
    'Kamil Semeniuk',
    'Nimir Abdel-Aziz',
    'Jenia Grebennikov',
    'Facundo Conte',
    'Luciano De Cecco',
    'Mauricio Borges',
    'Douglas Souza',
  ]

  // Insert football players + tokens
  for (const name of footballPlayers) {
    const player = await prisma.player.create({
      data: { name, position: 'Forward',  sportId: football.id, avatar },
    })

    await prisma.token.create({
      data: {
        playerId: player.id,
        symbol: `$${name.split(' ')[0].toUpperCase()}_${Math.floor(Math.random() * 1000)}`,

        price: 1,
        mint: 'FGNUEDUS7QcFXcpEN6GSWwmKEaFvjYQJRKw1oPj9Nme8',
      },
    })
  }

  // Basketball
  for (const name of basketballPlayers) {
    const player = await prisma.player.create({
      data: { name, position: 'Guard',  sportId: basketball.id, avatar },
    })

    await prisma.token.create({
      data: {
        playerId: player.id,
        symbol: `$${name.split(' ')[0].toUpperCase()}_${Math.floor(Math.random() * 1000)}`,

        price: 1,
        mint: 'FGNUEDUS7QcFXcpEN6GSWwmKEaFvjYQJRKw1oPj9Nme8',
      },
    })
  }

  // Volleyball
  for (const name of volleyballPlayers) {
    const player = await prisma.player.create({
      data: { name, position: 'Spiker',  sportId: volleyball.id, avatar }, // adjust enum if volleyball added
    })

    await prisma.token.create({
      data: {
        playerId: player.id,
        symbol: `$${name.split(' ')[0].toUpperCase()}_${Math.floor(Math.random() * 1000)}`,

        price: 1,
        mint: 'FGNUEDUS7QcFXcpEN6GSWwmKEaFvjYQJRKw1oPj9Nme8',
      },
    })
  }

  // ---------------------
  // MATCHES + PLAYER STATS
  // ---------------------
  const match1 = await prisma.match.create({
    data: { leagueId: footballLeague.id, date: new Date('2025-09-30') },
  })

  const player = await prisma.player.findFirst({ where: {  sportId: football.id} })

  if (player) {
    await prisma.playerStat.create({
      data: {
        playerId: player.id,
        matchId: match1.id,
        type: StatType.GOALS,
        value: 2,
      },
    })

    await prisma.playerPerformance.create({
      data: {
        playerId: player.id,
        matchId: match1.id,
        performancePct: 85,
      },
    })
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
