import { helius_url } from '@/lib/constant'
import { MetadataResponse } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { useWalletUi, useWalletUiCluster } from '@wallet-ui/react'
import axios from 'axios'
import { Address } from 'gill'


export function useGetTokenMetadata({ address }: { address: Address }) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()

  return useQuery({
    queryKey: ['get-token-metadata', { cluster, address }],
    queryFn: async () => {
      const data = axios.post(
        helius_url,
        JSON.stringify({
          jsonrpc: '2.0',
          id: 'test',
          method: 'getAsset',
          params: {
            id: `${address}`,
          },
        }),
      )
      const response = await (await data).data

      const tokenMetadata: MetadataResponse = {
        name: response?.result.content.metadata.name || 'Unknown',
        symbol: response?.result.content.metadata.symbol || 'Unknown',
      }

      return tokenMetadata
    },
  })
}
