import { TokenData } from '@/types'
import { UiWalletAccount, useWalletUiCluster } from '@wallet-ui/react'
import { Button } from '../ui/button'
import { getExplorerLink } from 'gill'
import Link from 'next/link'
import { useCreatePool } from './create-token-data-access'
import { Loader2 } from 'lucide-react'

function CreatPool({
  onNext,
  account,
  tokenData,
}: {
  onNext: () => void
  account: UiWalletAccount
  tokenData: TokenData
}) {
  const { cluster } = useWalletUiCluster()
  const createPool = useCreatePool(account)

  const handleCreatePool = async () => {
    await createPool.mutateAsync({
      pairedMint: tokenData.mint.address,
    })
  }

  return (
    <div className="flex flex-col gap-4 p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold font-jersey25">Player Token Information</h2>
        <div className="flex items-center ">
          <img
            // width={300}
            // height={150}
            src={tokenData.uri}
            alt={tokenData.name}
            className="w-70 h-70 object-cover rounded-md"
          />
          <div>
            <div className="flex items-center">
              <p className="text-xl font-jersey25">Name:</p>
              <div className="ml-2 font-normal">{tokenData.name}</div>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-jersey25">Symbol:</p>
              <div className="ml-2">{tokenData.symbol}</div>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-jersey25">Token mint:</p>
              <div className="ml-2">
                <Link
                  href={getExplorerLink({
                    cluster: cluster.cluster,
                    address: tokenData.mint.address,
                  })}
                  target="_blank"
                >
                  {tokenData.mint.address.slice(0, 5)}...
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-xl font-jersey25">Description:</p>
              <div className="ml-2">{tokenData.description}</div>
            </div>
          </div>
        </div>
      </div>
      <Button
        disabled={createPool.isPending}
        onClick={handleCreatePool}
        className="w-full py-2 px-4 bg-primary-mojo text-white transition-colors"
      >
        {createPool.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating pool...
          </>
        ) : (
          '   Create Pool'
        )}
      </Button>
    </div>
  )
}

export default CreatPool
