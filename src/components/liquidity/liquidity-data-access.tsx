import {
  UiWalletAccount,
  useWalletAccountTransactionSendingSigner,
  useWalletUi,
  useWalletUiCluster,
} from '@wallet-ui/react'
import { useTransactionToast } from '../use-transaction-toast'
import {
  address,
  Address,
  createTransaction,
  getAddressEncoder,
  getBase58Decoder,
  getExplorerLink,
  getProgramDerivedAddress,
  getSignatureFromTransaction,
  signAndSendTransactionMessageWithSigners,
  signTransactionMessageWithSigners,
} from 'gill'
import { useMutation } from '@tanstack/react-query'
import {
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  getAssociatedTokenAccountAddress,
  TOKEN_PROGRAM_ADDRESS,
} from 'gill/programs/token'
import { getAddLiquidityInstruction, MOJO_CONTRACT_PROGRAM_ADDRESS } from '@/generated/ts'
import { baseMint } from '@/lib/constant'
import { SYSTEM_PROGRAM_ADDRESS } from 'gill/programs'
import { toast } from 'sonner'

export function useAddLiquidity(account: UiWalletAccount) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const toastTransaction = useTransactionToast(cluster)

  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)
  const addressEncoder = getAddressEncoder()

  return useMutation({
    mutationKey: ['add-liquidity', { cluster, txSigner }],
    mutationFn: async ({
      baseAmount,
      pairedMint,
      pairedAmount,
    }: {
      baseAmount: number
      pairedMint: Address
      pairedAmount: number
    }) => {
      try {
        // get the latest blockhash
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        const [pairPDA] = await getProgramDerivedAddress({
          programAddress: MOJO_CONTRACT_PROGRAM_ADDRESS,
          seeds: ['pair', addressEncoder.encode(baseMint), addressEncoder.encode(pairedMint)],
        })

        const [lpMintPDA] = await getProgramDerivedAddress({
          programAddress: MOJO_CONTRACT_PROGRAM_ADDRESS,
          seeds: ['lp_mint', addressEncoder.encode(pairPDA)],
        })

        const baseVault = await getAssociatedTokenAccountAddress(baseMint, pairPDA, TOKEN_PROGRAM_ADDRESS)
        const pairedVault = await getAssociatedTokenAccountAddress(pairedMint, pairPDA, TOKEN_PROGRAM_ADDRESS)
        const userBaseAta = await getAssociatedTokenAccountAddress(baseMint, txSigner.address, TOKEN_PROGRAM_ADDRESS)
        const userPairedAta = await getAssociatedTokenAccountAddress(
          pairedMint,
          txSigner.address,
          TOKEN_PROGRAM_ADDRESS,
        )

        const userLpAta = await getAssociatedTokenAccountAddress(lpMintPDA, txSigner, TOKEN_PROGRAM_ADDRESS)

        const ix = getAddLiquidityInstruction({
          user: txSigner,
          pair: pairPDA,
          pairedVault,
          baseVault,
          userBaseAta,
          userPairedAta,
          lpMint: lpMintPDA,
          baseAmount,
          pairedAmount,
          userLpAta,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
          systemProgram: SYSTEM_PROGRAM_ADDRESS,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
        })

        const tx = createTransaction({
          feePayer: txSigner,
          instructions: [ix],
          latestBlockhash,
          version: 'legacy',
        })

        const signedTransaction = await signAndSendTransactionMessageWithSigners(tx)
        let signature = getBase58Decoder().decode(signedTransaction)

        console.log(
          'Explorer:',
          getExplorerLink({
            cluster: cluster.cluster,
            transaction: signature,
          }),
        )
        return signature
      } catch (error) {
        console.log(error, 'err')
        throw error
      }
    },
    onSuccess: (signature: string) => {
      toastTransaction(signature)
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`)
    },
  })
}
