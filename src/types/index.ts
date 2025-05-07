import { Pair } from "@/generated/ts";
import { Account, KeyPairSigner } from "gill";

  export interface Player {
    id: number;
    name: string;
    position: string;
    league: string;
    team: string;
    goals: number;
    assists: number;
    appearances: number;
    image: string;
    leagueBadge: string;
  }

  export type TokenData = {
    mint: KeyPairSigner
    description?: string
    name: string
    symbol: string
    uri: string
  }

  export type MetadataResponse = {
    name: string
    symbol: string
  }

  export type PairWithMetadata = Account<Pair> & {
    baseTokenMetadata: MetadataResponse | null;
    pairedTokenMetadata: MetadataResponse | null;
  };