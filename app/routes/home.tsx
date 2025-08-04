import "./home.css";
import * as gameService from "../services/game.service";
import { useEffect, useState } from "react";
import type { GameMatch } from "~/models/game/GameMatch.model";

export default function Home() {
  const [match, setMatch] = useState<GameMatch>();

  const handleStartMatch = async () => {
    const newMatch = await gameService.startMatch();
    setMatch(newMatch);
  };

  useEffect(() => {
    console.log("this is socket registartion useeffect from game");
    gameService.registerCallback(setMatch);
  }, []);

  const renderContent = () => {
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
          <div className="finding-match">
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
            <button className="start-button" onClick={() => setMatch(undefined)}>
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
