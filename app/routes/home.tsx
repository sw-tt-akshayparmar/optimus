import "./home.css";
import * as gameService from "../services/game.service";
export default function Home() {
  return (
    <div className="home-container">
      <button onClick={gameService.startMatch}>Start</button>
    </div>
  );
}
