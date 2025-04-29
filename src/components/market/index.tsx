import { TokenPair } from '@/types'
import { Card } from '../ui/card'
import { DataTable } from '../ui/data-table'
import { columns } from './column'

interface Props {
  page: number
  limit: number
}

// Token Pair Arrays
const tokenPairs: TokenPair[] = [
  {
    pairedToken: 'So11111111111111111111111111111111111111112', // SOL
    baseToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    baseSymbol: 'USDC',
    pairedSymbol: 'SOL',
    baaaseDecimals: 6,
    pairedDecimals: 9,
    baseReserve: '45328941.239548',
    pairedReserve: '18429.581073254896542371',
    pairAddress: '8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu',
    price: '105.58',
    fee: 0.3,
  },
  {
    pairedToken: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E', // BTC (Wrapped)
    baseToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    baseSymbol: 'USDC',
    pairedSymbol: 'BTC',
    baaaseDecimals: 6,
    pairedDecimals: 6,
    baseReserve: '25784532.487123',
    pairedReserve: '492.85720145',
    pairAddress: 'DZjbn4XC8qoHKikZqzmhemM5NueHMPrPrNfqrMbB7HVU',
    price: '52316.94',
    fee: 0.3,
  },
  {
    pairedToken: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', // mSOL
    baseToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    baseSymbol: 'USDC',
    pairedSymbol: 'mSOL',
    baaaseDecimals: 6,
    pairedDecimals: 9,
    baseReserve: '5482314.584263',
    pairedReserve: '5874582.471523687451238945',
    pairAddress: 'BxZxqX6dXb1hdqUKZxFqxhUg7J4DmyZAyrAQKpz6qYBi',
    price: '106.33',
    fee: 0.3,
  },
  {
    pairedToken: 'RLBxxFkseAZ4RgJH3Sqn8jXxhmGoz9jWxDNJMh8pL7a', // RAY
    baseToken: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
    baseSymbol: 'USDT',
    pairedSymbol: 'RAY',
    baaaseDecimals: 6,
    pairedDecimals: 6,
    baseReserve: '3785429.751058',
    pairedReserve: '329471.583942756824532154',
    pairAddress: 'DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67WB5AhHf',
    price: '1.49',
    fee: 0.3,
  },
  {
    pairedToken: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', // stSOL
    baseToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    baseSymbol: 'USDC',
    pairedSymbol: 'stSOL',
    baaaseDecimals: 6,
    pairedDecimals: 9,
    baseReserve: '32541865.257491',
    pairedReserve: '32539754.391246789523154782',
    pairAddress: '5F7LGsP1LPtaRV7vVKgxwNYX4Vf22xvuzyXjyar7jJqp',
    price: '105.94',
    fee: 0.3,
  },
]

export function Market() {
  return (
    <div>
      <Card className="flex itmes-center justify-between p-6 mt-2 bg-primary-mojo">
        <h3 className="text-4xl font-jersey15 text-white leading-7">
          Watch the game, <br /> track the stats & make <br />  your next big trade.
        </h3>
      </Card>

      <DataTable
        searchKey="pairedSymbol"
        columns={columns}
       
        data={tokenPairs}
        pageCount={0}
        pageIndex={0}
        nextPage={0}
      />
    </div>
  )
}
