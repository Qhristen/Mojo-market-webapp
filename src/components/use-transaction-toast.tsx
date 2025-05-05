import { toast } from 'sonner'
import { ExplorerLink } from './cluster/cluster-ui'
import { SolanaCluster } from '@wallet-ui/react'

export function useTransactionToast(cluster: SolanaCluster) {
  return (signature: string) => {
    toast('Transaction sent', {
      description: <ExplorerLink transaction={signature} cluster={cluster.cluster} label="View Transaction" />,
    })
  }
}
