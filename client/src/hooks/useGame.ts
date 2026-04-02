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
    pendingAction: null,
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
      const attacker = prev.players[prev.currentPlayer];
      const target = prev.players.find((p) => p.id === targetId);

      if (
        !target ||
        target.id === attacker.id ||
        attacker.coins < 3 ||
        prev.phase !== "action"
      )
        return prev;

      const newPlayers = [...prev.players];
      newPlayers[prev.currentPlayer] = {
        ...attacker,
        coins: (attacker.coins -= 3),
      };

      return {
        ...prev,
        players: newPlayers,
        pendingAction: {
          type: "assassinate",
          attackerId: attacker.id,
          targetId: target.id,
          requiredCard: "assassin",
        },
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

  function revealFirstAliveCard(player: GameState["players"][number]) {
    const card = player.cards.find((c) => !c.revealed);
    if (card) {
      card.revealed = true;
    }

    const aliveCards = player.cards.filter((c) => !c.revealed);

    if (aliveCards.length === 0) {
      player.alive = false;
    }
  }

  function challenge(challengerId: number) {
    setGame((prev) => {
      if (prev.phase !== "challenge" || !prev.pendingAction) return prev;

      const newPlayers = prev.players.map((player) => ({
        ...player,
        cards: player.cards.map((card) => ({ ...card })),
      }));

      const { attackerId, targetId, requiredCard, type } = prev.pendingAction;

      const attacker = newPlayers.find((p) => p.id === attackerId);
      const challenger = newPlayers.find((p) => p.id === challengerId);
      const target = newPlayers.find((p) => p.id === targetId);

      if (!attacker || !challenger || !target) return prev;
      if (challenger.id === attacker.id) return prev;

      const attackerHasCard = attacker.cards.some(
        (card) => card.type === requiredCard && !card.revealed,
      );

      if (attackerHasCard) {
        revealFirstAliveCard(challenger);

        if (type === "assassinate") {
          revealFirstAliveCard(target);
        }
      } else {
        revealFirstAliveCard(attacker);
      }

      const nextPlayer = (prev.currentPlayer + 1) % newPlayers.length;

      return {
        ...prev,
        players: newPlayers,
        currentPlayer: nextPlayer,
        phase: "action",
        pendingAction: null,
      };
    });
  }

  function skipChallenge() {
    setGame((prev) => {
      if (prev.phase !== "challenge" || !prev.pendingAction) return prev;

      const newPlayers = prev.players.map((player) => ({
        ...player,
        cards: player.cards.map((card) => ({ ...card })),
      }));

      const { targetId, type } = prev.pendingAction;
      const target = newPlayers.find((p) => p.id === targetId);

      if (!target) return prev;

      if (type === "assassinate") {
        revealFirstAliveCard(target);
      }

      const nextPlayer = (prev.currentPlayer + 1) % newPlayers.length;

      return {
        ...prev,
        players: newPlayers,
        currentPlayer: nextPlayer,
        phase: "action",
        pendingAction: null,
      };
    });
  }

  return { game, income, coup, assassinate, steal, challenge, skipChallenge };
}
