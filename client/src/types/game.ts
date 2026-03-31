export type CardType = "duke" | "assassin";

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

export type GameState = {
  players: Player[];
  currentPlayer: number;
  phase: "action" | "challenge" | "resolve";
};
