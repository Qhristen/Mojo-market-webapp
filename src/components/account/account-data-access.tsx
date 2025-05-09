'use client'

import {
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  getAssociatedTokenAccountAddress,
  TOKEN_2022_PROGRAM_ADDRESS,
  TOKEN_PROGRAM_ADDRESS,
} from 'gill/programs/token'
import { getTransferSolInstruction, SYSTEM_PROGRAM_ADDRESS } from 'gill/programs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  UiWalletAccount,
  useWalletAccountTransactionSendingSigner,
  useWalletUi,
  useWalletUiCluster,
} from '@wallet-ui/react'
import {
  address,
  Address,
  airdropFactory,
  appendTransactionMessageInstruction,
  assertIsTransactionMessageWithSingleSendingSigner,
  Blockhash,
  createTransactionMessage,
  generateKeyPair,
  generateKeyPairSigner,
  getBase58Decoder,
  getExplorerLink,
  getProgramDerivedAddress,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signAndSendTransactionMessageWithSigners,
  SolanaClient,
  TransactionSendingSigner,
} from 'gill'
import { toast } from 'sonner'
import { useTransactionToast } from '../use-transaction-toast'
import {
  fetchPlatformState,
  getInitializePlatformInstructionAsync,
  MOJO_CONTRACT_PROGRAM_ADDRESS,
} from '@/generated/ts'
import { baseMint } from '@/lib/constant'

export function useGetBalance({ address }: { address: Address }) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()

  return useQuery({
    queryKey: ['get-balance', { cluster, address }],
    queryFn: () =>
      client.rpc
        .getBalance(address)
        .send()
        .then((res) => res.value),
  })
}
export function useGetTokenAccountBalance({ address, account }: { address: Address, account: UiWalletAccount }) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()

  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)

  return useQuery({
    queryKey: ['get-token-account-balance', { cluster, address, account }],
    queryFn: async () => {
      const ata = await getAssociatedTokenAccountAddress(address, txSigner, TOKEN_PROGRAM_ADDRESS)
      return client.rpc
        .getTokenAccountBalance(ata, { commitment: 'confirmed' })
        .send()
        .then((res) => res.value)
    },
  })
}

export function useGetSignatures({ address }: { address: Address }) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()

  return useQuery({
    queryKey: ['get-signatures', { cluster, address }],
    queryFn: () => client.rpc.getSignaturesForAddress(address).send(),
  })
}

export function useGetTokenAccounts({ address }: { address: Address }) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()

  return useQuery({
    queryKey: ['get-token-accounts', { cluster, address }],
    queryFn: async () =>
      Promise.all([
        client.rpc
          .getTokenAccountsByOwner(
            address,
            { programId: TOKEN_PROGRAM_ADDRESS },
            { commitment: 'confirmed', encoding: 'jsonParsed' },
          )
          .send()
          .then((res) => res.value ?? []),
        client.rpc
          .getTokenAccountsByOwner(
            address,
            { programId: TOKEN_2022_PROGRAM_ADDRESS },
            { commitment: 'confirmed', encoding: 'jsonParsed' },
          )
          .send()
          .then((res) => res.value ?? []),
      ]).then(([tokenAccounts, token2022Accounts]) => [...tokenAccounts, ...token2022Accounts]),
  })
}

export function useTransferSol({ address, account }: { address: Address; account: UiWalletAccount }) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const toastTransaction = useTransactionToast(cluster)
  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['transfer-sol', { cluster, address }],
    mutationFn: async (input: { destination: Address; amount: number }) => {
      try {
        const { signature } = await createTransaction({
          txSigner,
          destination: input.destination,
          amount: input.amount,
          client,
        })

        console.log(signature)
        return signature
      } catch (error: unknown) {
        console.log('error', `Transaction failed! ${error}`)

        return
      }
    },
    onSuccess: (signature) => {
      if (signature?.length) {
        toastTransaction(signature)
      }
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['get-balance', { cluster, address }],
        }),
        queryClient.invalidateQueries({
          queryKey: ['get-signatures', { cluster, address }],
        }),
      ])
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`)
    },
  })
}

export function useRequestAirdrop({ address }: { address: Address }) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const queryClient = useQueryClient()
  const toastTransaction = useTransactionToast(cluster)
  const airdrop = airdropFactory(client)

  return useMutation({
    mutationKey: ['airdrop', { cluster, address }],
    mutationFn: async (amount: number = 1) =>
      airdrop({
        commitment: 'confirmed',
        recipientAddress: address,
        lamports: lamports(BigInt(Math.round(amount * 1_000_000_000))),
      }),
    onSuccess: (signature) => {
      toastTransaction(signature)
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['get-balance', { cluster, address }] }),
        queryClient.invalidateQueries({ queryKey: ['get-signatures', { cluster, address }] }),
      ])
    },
  })
}

async function createTransaction({
  amount,
  destination,
  client,
  txSigner,
}: {
  amount: number
  destination: Address
  client: SolanaClient
  txSigner: TransactionSendingSigner
}): Promise<{
  signature: string
  latestBlockhash: {
    blockhash: Blockhash
    lastValidBlockHeight: bigint
  }
}> {
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayerSigner(txSigner, m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstruction(
        getTransferSolInstruction({
          amount,
          destination: address(destination),
          source: txSigner,
        }),
        m,
      ),
  )
  assertIsTransactionMessageWithSingleSendingSigner(message)

  const signature = await signAndSendTransactionMessageWithSigners(message)

  return {
    signature: getBase58Decoder().decode(signature),
    latestBlockhash,
  }
}

export function useInitializePlatform(account: UiWalletAccount) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const toastTransaction = useTransactionToast(cluster)
  const queryClient = useQueryClient()

  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)

  return useMutation({
    mutationKey: ['initialize-platform', { cluster, account }],
    mutationFn: async () => {
      try {
        const [platformPDA] = await getProgramDerivedAddress({
          programAddress: MOJO_CONTRACT_PROGRAM_ADDRESS,
          seeds: ['platform-state'],
        })

        const platformTreasury = await getAssociatedTokenAccountAddress(baseMint, platformPDA, TOKEN_PROGRAM_ADDRESS)

        // get the latest blockhash
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        const ix = await getInitializePlatformInstructionAsync({
          admin: txSigner,
          baseTokenMint: baseMint,
          protocolFeeRate: 30,
          platformState: platformPDA,
          platformTreasury,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
          systemProgram: SYSTEM_PROGRAM_ADDRESS,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
        })
        console.log('ix', ix)
        const message = pipe(
          createTransactionMessage({ version: 0 }),
          (m) => setTransactionMessageFeePayerSigner(txSigner, m),
          (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
          (m) => appendTransactionMessageInstruction(ix, m),
        )
        assertIsTransactionMessageWithSingleSendingSigner(message)

        console.log('ix22', ix)
        try {
          const signedTransaction = await signAndSendTransactionMessageWithSigners(message)
          let signature = getBase58Decoder().decode(signedTransaction)
          console.log(
            'Explorer:',
            getExplorerLink({
              cluster: cluster.cluster,
              transaction: signature,
            }),
          )
          return signature
        } catch (error: any) {
          if (error.logs) {
            console.error('Transaction failed with logs:', error.logs)
          }
          throw new Error(`Transaction failed: ${error}`)
        }
      } catch (error) {
        console.log(error, 'err')
        throw error
      }
    },
    onSuccess: (signature: string) => {
      toastTransaction(signature)
      queryClient.invalidateQueries({ queryKey: ['fetch-platform-state', { cluster }] })
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`)
    },
  })
}

export function usFetchPlatformState() {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()

  return useQuery({
    queryKey: ['fetch-platform-state', { cluster }],
    queryFn: async () => {
      const [platformPDA] = await getProgramDerivedAddress({
        programAddress: MOJO_CONTRACT_PROGRAM_ADDRESS,
        seeds: ['platform-state'],
      })
      console.log(platformPDA, 'platformPDA')

      const platformState = await fetchPlatformState(client.rpc, platformPDA, { commitment: 'confirmed' })
      console.log(platformState.data, 'platformState.data')

      return platformState
    },
  })
}
