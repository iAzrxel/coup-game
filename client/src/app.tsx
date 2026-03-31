import { useGame } from "./hooks/useGame";

function App() {
  const { game, income, coup } = useGame();
  return (
    <div>
      <h1>Jogo de Cartas</h1>

      <p>Turno do jogador: {game.currentPlayer + 1}</p>

      {game.players.map((player) => (
        <div key={player.id}>
          <h2>Jogador {player.id}</h2>
          <p>Moedas: {player.coins}</p>
          <p>Cartas: {player.cards.filter((c) => !c.revealed).length}</p>

          {player.id !== game.players[game.currentPlayer].id && (
            <button onClick={() => coup(player.id)}>Dar golpe</button>
          )}
        </div>
      ))}

      <button onClick={income}>Renda (+1 moeda)</button>
    </div>
  );
}

export default App;
