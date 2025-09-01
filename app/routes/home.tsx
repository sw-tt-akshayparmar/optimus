import "./home.css";
import { useEffect, useState } from "react";
import type { GameMatch } from "~/models/game/GameMatch.model";
import gameClient from "../services/game.service";
import Loader from "~/components/Loader";

export default function Home() {
  const [match, setMatch] = useState<GameMatch>();
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  const handleStartMatch = async () => {
    setOpponentDisconnected(false);
    const newMatch = await gameClient.startMatch();
    setMatch(newMatch);
  };

  useEffect(() => {
    gameClient.onMatchFound(setMatch);
    gameClient.onOpponetDisconnect(() => {
      setOpponentDisconnected(true);
    });
  }, []);

  const renderContent = () => {
    if (opponentDisconnected) {
      return (
        <div className="opponent-disconnected">
          <h2>Opponent Disconnected</h2>
          <p>Your opponent has left the game.</p>
          <button
            className="start-button"
            onClick={() => {
              setMatch(undefined);
              setOpponentDisconnected(false);
              handleStartMatch();
            }}
          >
            Find New Game
          </button>
        </div>
      );
    }
    if (!match) {
      return (
        <>
          <h1>Welcome to Optimus </h1>
          <button className="start-button" onClick={handleStartMatch}>
            Start
          </button>
        </>
      );
    }

    switch (match.status) {
      case "PENDING":
        return (
          <div className="finding-match" style={{ position: "relative" }}>
            <h2>Finding Match...</h2>
            <div className="progress-bar-container">
              <div className="progress-bar"></div>
            </div>
            <div className="match-details">
              <p>
                <strong>Game Status:</strong> {match.status}
              </p>
              <p>
                <strong>User:</strong> {match.userId}
              </p>
            </div>
            <Loader />
          </div>
        );
      case "ACTIVE":
        return (
          <div className="active-game">
            <h2>Game in Progress!</h2>
            <div className="match-details">
              <p>
                <strong>Match ID:</strong> {match.game!.id}
              </p>
              <p>
                <strong>Opponent:</strong> {match.opponentId}
              </p>
              <p>
                <strong>Turn:</strong> {match.turn}
              </p>
            </div>
            <div className="game-board-placeholder">
              <p>-- Basic Game UI --</p>
              <p>Your move!</p>
            </div>
            <button
              className="start-button"
              onClick={() => {
                setMatch(undefined);
                setOpponentDisconnected(false);
              }}
            >
              End Game
            </button>
          </div>
        );
      default:
        return (
          <>
            <h1>Welcome to Optimus Games</h1>
            <button className="start-button" onClick={handleStartMatch}>
              Start New Game
            </button>
          </>
        );
    }
  };

  return <div className="home-container">{renderContent()}</div>;
}
