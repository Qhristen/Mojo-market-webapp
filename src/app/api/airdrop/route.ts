import { baseMint } from '@/lib/constant'
import { address, createSolanaClient, createTransaction, signTransactionMessageWithSigners } from 'gill'
import { loadKeypairSignerFromEnvironment } from 'gill/node'
import {
  getAssociatedTokenAccountAddress,
  getCreateAssociatedTokenIdempotentInstruction,
  getMintToInstruction,
  TOKEN_PROGRAM_ADDRESS
} from 'gill/programs/token'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { amount, destination } = await req.json() // `destination` = user address

    if (!amount || !destination) {
      return NextResponse.json({ error: 'Missing amount or destination' }, { status: 400 })
    }

    const { rpc, sendAndConfirmTransaction } = createSolanaClient({
      urlOrMoniker: 'devnet',
    })

    const authority = await loadKeypairSignerFromEnvironment('OWNER_WALLET_PRIVATE_KEY')

    const { value: latestBlockhash } = await rpc.getLatestBlockhash({ commitment: 'confirmed' }).send()

    const destinationAta = await getAssociatedTokenAccountAddress(baseMint, address(destination), TOKEN_PROGRAM_ADDRESS)

    const transaction = createTransaction({
      feePayer: authority,
      version: "legacy",
      instructions: [
        // create idempotent will gracefully fail if the ata already exists. this is the gold standard!
        getCreateAssociatedTokenIdempotentInstruction({
          mint: baseMint,
          payer: authority,
          tokenProgram: TOKEN_PROGRAM_ADDRESS,
          owner: destination,
          ata: destinationAta,
        }),
        getMintToInstruction(
          {
            mint: baseMint,
            mintAuthority: authority,
            token: destinationAta,
            amount: Number(amount),
          },
          {
            programAddress: TOKEN_PROGRAM_ADDRESS,
          },
        ),
      ],
      latestBlockhash,
    });
    
    const signedTransaction = await signTransactionMessageWithSigners(transaction);
    
   
   const signature = await sendAndConfirmTransaction(signedTransaction);

    return NextResponse.json({ signature })
  } catch (err) {
    console.error('Airdrop error:', err)
    return NextResponse.json({ error: 'Internal server error', message: err }, { status: 500 })
  }
}
