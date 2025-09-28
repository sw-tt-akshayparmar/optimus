import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ChessboardComponent } from '../../components/chessboard/chessboard.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [ChessboardComponent],
})
export class HomeComponent {
  match: any = null;
  opponentDisconnected = false;

  constructor(private gameService: GameService) {}

  handleStartMatch() {
    this.opponentDisconnected = false;
    this.gameService.startMatch().subscribe((match) => (this.match = match));
  }
}
