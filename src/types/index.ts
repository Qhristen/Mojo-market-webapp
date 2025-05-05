import { KeyPairSigner } from "gill";

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