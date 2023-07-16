import React, { useState, useEffect } from "react";

function App() {
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState({
    name: '',
    stats: {
      puntos: 0,
      asistencias: 0,
      rebotes: 0,
      bloqueos: 0
    }
  });
  const [avgStats, setAvgStats] = useState({
    puntos: 0,
    asistencias: 0,
    rebotes: 0,
    bloqueos: 0
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');

  useEffect(() => {
    const localGames = localStorage.getItem('games');
    setGames(localGames ? JSON.parse(localGames) : []);
  }, []);

  useEffect(() => {
    if (games && games.length > 0) {
      const totalStats = games.reduce((acc, game) => {
        if (game && game.stats) {
          return {
            puntos: acc.puntos + (game.stats.puntos || 0),
            asistencias: acc.asistencias + (game.stats.asistencias || 0),
            rebotes: acc.rebotes + (game.stats.rebotes || 0),
            bloqueos: acc.bloqueos + (game.stats.bloqueos || 0),
          };
        } else {
          return acc;
        }
      }, { puntos: 0, asistencias: 0, rebotes: 0, bloqueos: 0 });
  
      setAvgStats({
        puntos: (totalStats.puntos / games.length) || 0,
        asistencias: (totalStats.asistencias / games.length) || 0,
        rebotes: (totalStats.rebotes / games.length) || 0,
        bloqueos: (totalStats.bloqueos / games.length) || 0,
      });
    } else {
      setAvgStats({ puntos: 0, asistencias: 0, rebotes: 0, bloqueos: 0 });
    }
  }, [games]);
  

  const addGame = () => {
    const newGames = [...games];
    if(editingIndex !== null){
      newGames[editingIndex] = currentGame;
    } else {
      newGames.push(currentGame);
    }
    setGames(newGames);
    localStorage.setItem('games', JSON.stringify(newGames));
    setCurrentGame({ name: '', stats: { puntos: 0, asistencias: 0, rebotes: 0, bloqueos: 0 } }); // resetear el formulario
    setEditingIndex(null);
  };

  const deleteGame = (index) => {
    const newGames = [...games];
    newGames.splice(index, 1);
    setGames(newGames);
    localStorage.setItem('games', JSON.stringify(newGames));
  }

  const editGame = (index) => {
    setEditingIndex(index);
    setCurrentGame(games[index]);
  }

  const resetGames = () => {
    setGames([]);
    localStorage.removeItem('games');
  };

  const handleChange = (e) => {
    if(['puntos', 'asistencias', 'rebotes', 'bloqueos'].includes(e.target.name)){
      setCurrentGame({
        ...currentGame,
        stats: {
          ...currentGame.stats,
          [e.target.name]: parseInt(e.target.value)
        }
      });
    } else {
      setCurrentGame({
        ...currentGame,
        [e.target.name]: e.target.value
      });
    }
  };

  return (
    <div>
      <label>
        Nombre del jugador:
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Nombre del jugador"
        />
      </label>
      <label>
         # de jersey:
        <input
          type="number"
          value={jerseyNumber}
          onChange={(e) => setJerseyNumber(e.target.value)}
          placeholder="# del jersey"
        />
      </label>
      <label>
        Nombre del juego:
        <input
          type="text"
          name="name"
          value={currentGame.name}
          onChange={handleChange}
          placeholder="Nombre del juego"
        />
      </label>
      <label>
        Puntos:
        <input
          type="number"
          name="puntos"
          value={currentGame.stats.puntos}
          onChange={handleChange}
        />
      </label>
      <label>
        Asistencias:
        <input
          type="number"
          name="asistencias"
          value={currentGame.stats.asistencias}
          onChange={handleChange}
        />
      </label>
      <label>
        Rebotes:
        <input
          type="number"
          name="rebotes"
          value={currentGame.stats.rebotes}
          onChange={handleChange}
        />
      </label>
      <label>
        Bloqueos:
        <input
          type="number"
          name="bloqueos"
          value={currentGame.stats.bloqueos}
          onChange={handleChange}
        />
      </label>
      <button onClick={addGame}>Agregar/Actualizar juego</button>
      
      {playerName && jerseyNumber && <h1>Temporada de {playerName} #{jerseyNumber}</h1>}
      
      {games && games.length > 0 && games.map((game, index) => (
        game && (
          <div key={index}>
            <h2>{game.name}</h2>
            <table>
              <thead>
                <tr>
                  <th>Puntos</th>
                  <th>Asistencias</th>
                  <th>Rebotes</th>
                  <th>Bloqueos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{game.stats.puntos}</td>
                  <td>{game.stats.asistencias}</td>
                  <td>{game.stats.rebotes}</td>
                  <td>{game.stats.bloqueos}</td>
                </tr>
              </tbody>
            </table>
            <button onClick={() => editGame(index)}>Editar</button>
            <button onClick={() => deleteGame(index)}>Eliminar</button>
          </div>
        )
      ))}

      <h2>Promedios</h2>
      <p>Puntos: {avgStats.puntos.toFixed(2)}</p>
      <p>Asistencias: {avgStats.asistencias.toFixed(2)}</p>
      <p>Rebotes: {avgStats.rebotes.toFixed(2)}</p>
      <p>Bloqueos: {avgStats.bloqueos.toFixed(2)}</p>

      <button onClick={resetGames}>Restablecer juegos</button>
    </div>
  );
}

export default App;
