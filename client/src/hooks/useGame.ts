import { useState } from "react";
import type { GameState } from "../types/game";

export function useGame() {
  const [game, setGame] = useState<GameState>({
    players: [
      {
        id: 1,
        coins: 2,
        alive: true,
        cards: [
          { type: "duke", revealed: false },
          { type: "assassin", revealed: false },
        ],
      },
      {
        id: 2,
        coins: 2,
        alive: true,
        cards: [
          { type: "duke", revealed: false },
          { type: "assassin", revealed: false },
        ],
      },
    ],
    currentPlayer: 0,
    phase: "action",
  });

  function income() {
    setGame((prev) => {
      const newPlayers = [...prev.players];

      const current = newPlayers[prev.currentPlayer];

      current.coins += 1;

      const nextPlayer = (prev.currentPlayer + 1) % newPlayers.length;

      return {
        ...prev,
        players: newPlayers,
        currentPlayer: nextPlayer,
      };
    });
  }

  function coup(targetId: number) {
    setGame((prev) => {
      const newPlayers = [...prev.players];

      const attacker = newPlayers[prev.currentPlayer];
      const target = newPlayers.find((p) => p.id === targetId);

      if (!target || attacker.coins < 7) return prev;

      attacker.coins -= 7;

      const card = target.cards.find((c) => !c.revealed);
      if (card) {
        card.revealed = true;
      }

      const aliveCards = target.cards.filter((c) => !c.revealed);
      if (aliveCards.length === 0) {
        target.alive = false;
      }

      const nextPlayer = (prev.currentPlayer + 1) % newPlayers.length;

      return {
        ...prev,
        players: newPlayers,
        currentPlayer: nextPlayer,
      };
    });
  }

  function assassinate(targetId: number) {
    setGame((prev) => {
      const newPlayers = [...prev.players];

      const attacker = newPlayers[prev.currentPlayer];
      const target = newPlayers.find((p) => p.id === targetId);

      if (!target || attacker.coins < 3) return prev;

      attacker.coins -= 3;

      const card = target.cards.find((c) => !c.revealed);
      if (card) {
        card.revealed = true;
      }

      const aliveCards = target.cards.filter((c) => !c.revealed);
      if (aliveCards.length === 0) {
        target.alive = false;
      }

      const nextPlayer = (prev.currentPlayer + 1) % newPlayers.length;

      return {
        ...prev,
        players: newPlayers,
        currentPlayer: nextPlayer,
      };
    });
  }

  function steal(targetId: number) {
    setGame((prev) => {
      const newPlayers = [...prev.players];

      const attacker = newPlayers[prev.currentPlayer];
      const target = newPlayers.find((p) => p.id === targetId);

      if (!target || target.id === attacker.id) return prev;

      const amount = Math.min(2, target.coins);

      attacker.coins += amount;
      target.coins -= amount;

      const nextPlayer = (prev.currentPlayer + 1) % newPlayers.length;

      return {
        ...prev,
        players: newPlayers,
        currentPlayer: nextPlayer,
      };
    });
  }

  return { game, income, coup, assassinate, steal };
}
