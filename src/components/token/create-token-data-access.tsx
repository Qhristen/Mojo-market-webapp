import {
  fetchAllMaybePair,
  getCreatePairInstructionAsync,
  getPairDiscriminatorBytes,
  MOJO_CONTRACT_PROGRAM_ADDRESS,
  PAIR_DISCRIMINATOR
} from '@/generated/ts'
import { baseMint } from '@/lib/constant'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  UiWalletAccount,
  useWalletAccountTransactionSendingSigner,
  useWalletUi,
  useWalletUiCluster,
} from '@wallet-ui/react'
import {
  Address,
  createTransaction,
  getAddressEncoder,
  getBase58Decoder,
  getExplorerLink,
  getProgramDerivedAddress,
  KeyPairSigner,
  signAndSendTransactionMessageWithSigners
} from 'gill'
import { SYSTEM_PROGRAM_ADDRESS } from 'gill/programs'
import {
  ASSOCIATED_TOKEN_PROGRAM_ADDRESS,
  buildCreateTokenTransaction,
  buildMintTokensTransaction,
  buildTransferTokensTransaction,
  getAssociatedTokenAccountAddress,
  TOKEN_PROGRAM_ADDRESS,
} from 'gill/programs/token'
import { toast } from 'sonner'
import { useTransactionToast } from '../use-transaction-toast'

type CreatTokenProps = {
  mint: KeyPairSigner
  description?: string
  metadata: {
    name: string
    symbol: string
    uri: string
    isMutable: true
  }
}

export function useCreateTokenWithMetatData(account: UiWalletAccount) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const toastTransaction = useTransactionToast(cluster)

  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)

  return useMutation({
    mutationKey: ['create-token-mint', { cluster, txSigner }],
    mutationFn: async ({ mint, metadata }: CreatTokenProps) => {
      try {
        // get the latest blockhash
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        //build token transaction
        const tx = await buildCreateTokenTransaction({
          feePayer: txSigner,
          latestBlockhash,
          mint: mint,
          decimals: 6,
          metadata,
        })

        console.log(tx.feePayer.address, 'fee payer')
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

export function useMintToken(account: UiWalletAccount) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const toastTransaction = useTransactionToast(cluster)

  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)

  return useMutation({
    mutationKey: ['mint-token', { cluster, txSigner }],
    mutationFn: async ({ mint, amount }: { mint: KeyPairSigner; amount: number }) => {
      try {
        // get the latest blockhash
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        //build token mint transaction
        const tx = await buildMintTokensTransaction({
          feePayer: txSigner,
          latestBlockhash,
          mint: mint,
          amount,
          mintAuthority: txSigner,
          destination: txSigner,
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

export function useTransferToken(account: UiWalletAccount) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const toastTransaction = useTransactionToast(cluster)

  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)

  return useMutation({
    mutationKey: ['transfer-token', { cluster, txSigner }],
    mutationFn: async ({
      mint,
      amount,
      destination,
    }: {
      mint: KeyPairSigner
      destination: Address
      amount: number
    }) => {
      try {
        // get the latest blockhash
        const { value: latestBlockhash } = await client.rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

        //build token transfer transaction
        const tx = await buildTransferTokensTransaction({
          feePayer: txSigner,
          latestBlockhash,
          mint: mint,
          amount,
          authority: mint,
          destination,
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

export function useCreatePool(account: UiWalletAccount) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const toastTransaction = useTransactionToast(cluster)

  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)
  const addressEncoder = getAddressEncoder()

  return useMutation({
    mutationKey: ['create-pool-pairs', { cluster, txSigner }],
    mutationFn: async ({ pairedMint, pairName }: { pairedMint: Address; pairName: string }) => {
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

        const [lpMint] = await getProgramDerivedAddress({
          programAddress: MOJO_CONTRACT_PROGRAM_ADDRESS,
          seeds: ['lp_mint', addressEncoder.encode(pairPDA)],
        })

        // const platformState = await fetchPlatformState(client.rpc, platformPDA)

        const ix = await getCreatePairInstructionAsync({
          creator: txSigner,
          pair: pairPDA,
          baseTokenMint: baseMint,
          pairedTokenMint: pairedMint,
          lpMint: lpMint,
          baseVault,
          pairedVault,
          pairName,
          platformState: platformPDA,
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

export function useUploadMetadata(account: UiWalletAccount) {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const txSigner = useWalletAccountTransactionSendingSigner(account, cluster.id)

  // const umi = createUmi(cluster.cluster)
  // umi.use(irysUploader())
  // const creator = generateSigner(umi)
  // umi.use(signerIdentity(creator))

  return useMutation({
    mutationKey: ['upload-metatdata', { cluster, account }],
    mutationFn: async ({
      imageUrl,
      name,
      symbol,
      description,
    }: {
      imageUrl: string
      name: string
      symbol: string
      description: string
    }) => {
      //   // 1. Fetch the image bytes
      //   const res = await fetch(imageUrl);
      //   if (!res.ok) {
      //     throw new Error(`Failed to fetch ${imageUrl}: ${res.statusText}`);
      //   }
      //   const arrayBuffer = await res.arrayBuffer();
      //   const buffer = Buffer.from(arrayBuffer);
      //   const file = createGenericFile(buffer, name, {
      //     contentType: res.headers.get("content-type") || "application/octet-stream",
      //   });
      //   // 3. Upload and return the URI
      //   const [imageUri] = await umi.uploader.upload([file]);
      //   const data = {
      //     name: name,
      //     symbol: symbol,
      //     description,
      //     image: imageUri,
      //     properties: {
      //         files: [
      //             {
      //                 type: "image/png",
      //                 uri:  imageUri
      //             },
      //         ]
      //     },
      //     creators: []
      // };
      // const myUri = await umi.uploader.uploadJson(data)
      //   console.log("✅ Uploaded to:", myUri);
      //   return myUri
    },
  })
}

export function useGetPools() {
  const { cluster } = useWalletUiCluster()
  const { client } = useWalletUi()
  const decoder = getBase58Decoder()

  return useQuery({
    queryKey: ['get-pools', { cluster }],
    queryFn: async () => {
      try {
        const pairBytes = getPairDiscriminatorBytes()

        const rawAccounts = await client.rpc
          .getProgramAccounts(MOJO_CONTRACT_PROGRAM_ADDRESS, {
            commitment: 'confirmed',
            dataSlice: { offset: 0, length: 0 },
            filters: [
              // Filter by the first 8 bytes (discriminator)
              {
                memcmp: {
                  offset: BigInt(0),
                  bytes: decoder.decode(pairBytes),
                  encoding: 'base58',
                },
              },
            ],
          })
          .send()

        console.log('tes2', decoder.decode(PAIR_DISCRIMINATOR))
        const resolvedAccounts = await Promise.all(rawAccounts)

        const addresses = resolvedAccounts.map((account) => account.pubkey)

        const pools = await fetchAllMaybePair(client.rpc, addresses, { commitment: 'confirmed' })

        return pools
      } catch (error) {
        throw error
      }
    },
  })
}
