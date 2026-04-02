export type CardType = "duke" | "assassin" | "captain";

export interface Card {
  type: CardType;
  revealed: boolean;
}

export interface Player {
  id: number;
  coins: number;
  cards: Card[];
  alive: boolean;
}

export type Phase = "action" | "challenge";

export type PendingAction = {
  type: "assassinate";
  attackerId: number;
  targetId: number;
  requiredCard: CardType;
} | null;

export type GameState = {
  players: Player[];
  currentPlayer: number;
  phase: Phase;
  pendingAction: PendingAction;
};
