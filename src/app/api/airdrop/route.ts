import { baseMint } from "@/lib/constant";
import { createSolanaClient, signTransactionMessageWithSigners } from "gill";
import { loadKeypairSignerFromEnvironment } from "gill/node";
import { buildMintTokensTransaction } from "gill/programs/token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, destination } = await req.json(); // `destination` = user address

    if (!amount || !destination) {
      return NextResponse.json({ error: 'Missing amount or destination' }, { status: 400 });
    }


    const { rpc, sendAndConfirmTransaction } = createSolanaClient({
        urlOrMoniker: "devnet",
      });
    const authority = await loadKeypairSignerFromEnvironment('OWNER_WALLET_PRIVATE_KEY');
    
    const { value: latestBlockhash } = await rpc.getLatestBlockhash({ commitment: 'confirmed' }).send();

    const tx = await buildMintTokensTransaction({
      feePayer: authority,
      latestBlockhash,
      mint: baseMint,
      amount,
      mintAuthority: authority,
      destination, // user pubkey
    });
    // Sign and send
    const signedTx = await signTransactionMessageWithSigners(tx);
    const sigResult = await sendAndConfirmTransaction(signedTx, { commitment: "confirmed"});

    const signature = sigResult;

    return NextResponse.json({ signature });
  } catch (err) {
    console.error('Airdrop error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
