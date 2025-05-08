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
  signAndSendTransactionMessageWithSigners,
} from 'gill'
import { useMutation } from '@tanstack/react-query'
import {
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  getAssociatedTokenAccountAddress,
  TOKEN_PROGRAM_ADDRESS,
} from 'gill/programs/token'
import { getSwapInstructionAsync, MOJO_CONTRACT_PROGRAM_ADDRESS } from '@/generated/ts'
import { baseMint } from '@/lib/constant'
import { SYSTEM_PROGRAM_ADDRESS } from 'gill/programs'
import { toast } from 'sonner'

export function useSwap(account: UiWalletAccount) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const toastTransaction = useTransactionToast(cluster)

  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)
  const addressEncoder = getAddressEncoder()

  return useMutation({
    mutationKey: ['swap-pairs', { cluster, txSigner }],
    mutationFn: async ({
      inputAmount,
      pairedMint,
      minOutputAmount,
    }: {
      inputAmount: number
      pairedMint: Address
      minOutputAmount: number
    }) => {
      try {
        // get the latest blockhash
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        const [platformPDA] = await getProgramDerivedAddress({
          programAddress: MOJO_CONTRACT_PROGRAM_ADDRESS,
          seeds: ['platform-state'],
        })

        const [pairPDA] = await getProgramDerivedAddress({
          programAddress: MOJO_CONTRACT_PROGRAM_ADDRESS,
          seeds: ['pair', addressEncoder.encode(baseMint), addressEncoder.encode(pairedMint)],
        })

        const baseVault = await getAssociatedTokenAccountAddress(baseMint, pairPDA, TOKEN_PROGRAM_ADDRESS)
        const pairedVault = await getAssociatedTokenAccountAddress(pairedMint, pairPDA, TOKEN_PROGRAM_ADDRESS)
        const userBaseTokenAccount = await getAssociatedTokenAccountAddress(
          baseMint,
          txSigner.address,
          TOKEN_PROGRAM_ADDRESS,
        )
        const userPairedTokenAccount = await getAssociatedTokenAccountAddress(
          pairedMint,
          txSigner.address,
          TOKEN_PROGRAM_ADDRESS,
        )
        const platformTreasury = await getAssociatedTokenAccountAddress(baseMint, platformPDA, TOKEN_PROGRAM_ADDRESS)
        const isBaseInput = pairedMint === baseMint

        const inputTokenAccount = isBaseInput ? userBaseTokenAccount : userPairedTokenAccount
        const outputTokenAccount = isBaseInput ? userPairedTokenAccount : userBaseTokenAccount

        const ix = await getSwapInstructionAsync({
          user: txSigner,
          pair: pairPDA,
          baseTokenMint: baseMint,
          pairedTokenMint: pairedMint,
          pairedVault,
          inputAmount: BigInt(inputAmount),
          baseVault,
          platformTreasury,
          baseTokenAccount: inputTokenAccount,
          minOutputAmount: BigInt(minOutputAmount),
          pairTokenAccount: outputTokenAccount,
          platformState: platformPDA,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
          systemProgram: SYSTEM_PROGRAM_ADDRESS,
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
