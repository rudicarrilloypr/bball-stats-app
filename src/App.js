import React, { useState, useEffect } from "react";
import './App.css';

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
    const localPlayerName = localStorage.getItem('playerName');
    setPlayerName(localPlayerName ? localPlayerName : '');
    const localJerseyNumber = localStorage.getItem('jerseyNumber');
    setJerseyNumber(localJerseyNumber ? localJerseyNumber : '');
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
    setPlayerName('');
    setJerseyNumber('');
    localStorage.removeItem('games');
    localStorage.removeItem('playerName');
    localStorage.removeItem('jerseyNumber');
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

  const handlePlayerNameChange = (e) => {
    setPlayerName(e.target.value);
    localStorage.setItem('playerName', e.target.value);
  };

  const handleJerseyNumberChange = (e) => {
    setJerseyNumber(e.target.value);
    localStorage.setItem('jerseyNumber', e.target.value);
  };

  return (
    <div className="app">
      <label className="player-label">
        Nombre del jugador:
        <input
          className="player-input"
          type="text"
          value={playerName}
          onChange={handlePlayerNameChange}
          placeholder="Nombre del jugador"
        />
      </label>
      <label className="jersey-label">
        # de jersey:
        <input
          className="jersey-input"
          type="number"
          value={jerseyNumber}
          onChange={handleJerseyNumberChange}
          placeholder="# del jersey"
        />
      </label>
      <label className="game-label">
        Nombre del juego:
        <input
          className="game-input"
          type="text"
          name="name"
          value={currentGame.name}
          onChange={handleChange}
          placeholder="vs. + equipo"
        />
      </label>
      <label className="points-label">
        Puntos:
        <input
          className="points-input"
          type="number"
          name="puntos"
          value={currentGame.stats.puntos}
          onChange={handleChange}
        />
      </label>
      <label className="assists-label">
        Asistencias:
        <input
          className="assists-input"
          type="number"
          name="asistencias"
          value={currentGame.stats.asistencias}
          onChange={handleChange}
        />
      </label>
      <label className="rebounds-label">
        Rebotes:
        <input
          className="rebounds-input"
          type="number"
          name="rebotes"
          value={currentGame.stats.rebotes}
          onChange={handleChange}
        />
      </label>
      <label className="blocks-label">
        Bloqueos:
        <input
          className="blocks-input"
          type="number"
          name="bloqueos"
          value={currentGame.stats.bloqueos}
          onChange={handleChange}
        />
      </label>
      <button className="add-button" onClick={addGame}>Agregar/Actualizar juego</button>
      
      {playerName && jerseyNumber && <h1 className="header">Temporada de {playerName} #{jerseyNumber}</h1>}
      
      {games && games.length > 0 && games.map((game, index) => (
        game && (
          <div className="game" key={index}>
            <h2 className="game-name">{game.name}</h2>
            <table className="game-table">
              <thead>
                <tr>
                  <th className="points-header">Puntos</th>
                  <th className="assists-header">Asistencias</th>
                  <th className="rebounds-header">Rebotes</th>
                  <th className="blocks-header">Bloqueos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="points-data">{game.stats.puntos}</td>
                  <td className="assists-data">{game.stats.asistencias}</td>
                  <td className="rebounds-data">{game.stats.rebotes}</td>
                  <td className="blocks-data">{game.stats.bloqueos}</td>
                </tr>
              </tbody>
            </table>
            <button className="edit-button" onClick={() => editGame(index)}>Editar</button>
            <button className="delete-button" onClick={() => deleteGame(index)}>Eliminar</button>
          </div>
        )
      ))}

      <h2 className="avg-header">Promedios por Juego</h2>
      <p className="points-avg">Puntos: {avgStats.puntos.toFixed(2)}</p>
      <p className="assists-avg">Asistencias: {avgStats.asistencias.toFixed(2)}</p>
      <p className="rebounds-avg">Rebotes: {avgStats.rebotes.toFixed(2)}</p>
      <p className="blocks-avg">Bloqueos: {avgStats.bloqueos.toFixed(2)}</p>

      <button className="reset-button" onClick={resetGames}>Restablecer juegos</button>
    </div>
  );
}

export default App;
