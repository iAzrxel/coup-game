import { useGame } from "./hooks/useGame";

function App() {
  const { game, income, coup, assassinate, steal, challenge, skipChallenge } =
    useGame();

  const currentPlayerId = game.players[game.currentPlayer].id;

  return (
    <div>
      <h1>Jogo de Cartas</h1>

      <p>Turno do jogador: {currentPlayerId}</p>
      <p>Fase atual: {game.phase}</p>

      {game.phase === "challenge" && game.pendingAction && (
        <div>
          <h2>DUVIDAR??</h2>
          <p>
            Jogador {game.pendingAction.attackerId} declarou{" "}
            {game.pendingAction.type} contra o jogador{" "}
            {game.pendingAction.targetId}
          </p>

          {game.players
            .filter(
              (player) =>
                player.id !== game.pendingAction!.attackerId && player.alive,
            )
            .map((player) => (
              <button key={player.id} onClick={() => challenge(player.id)}>
                Jogador {player.id} duvidar
              </button>
            ))}

          <button onClick={skipChallenge}>Ninguém duvida</button>
        </div>
      )}

      {game.players.map((player) => (
        <div key={player.id}>
          <h2>Jogador {player.id}</h2>
          <p>Moedas: {player.coins}</p>
          <p>Cartas vivas: {player.cards.filter((c) => !c.revealed).length}</p>
          <p>
            Cartas:{" "}
            {player.cards.map((c, i) => (
              <span key={i}>{c.revealed ? "🟥" : "🟩"} </span>
            ))}
          </p>

          {game.phase === "action" &&
            player.id !== currentPlayerId &&
            player.alive && (
              <>
                <button onClick={() => coup(player.id)}>Dar golpe</button>
                <button onClick={() => assassinate(player.id)}>
                  Assassinar
                </button>
                <button onClick={() => steal(player.id)}>Roubar</button>
              </>
            )}
        </div>
      ))}

      {game.phase === "action" && (
        <button onClick={income}>Renda (+1 moeda)</button>
      )}
    </div>
  );
}

export default App;
