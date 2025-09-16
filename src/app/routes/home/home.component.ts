import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [ButtonModule],
})
export class HomeComponent {
  match: any = null;
  opponentDisconnected = false;

  constructor(
    private gameService: GameService,
    private toastService: ToastService,
  ) {}

  handleStartMatch() {
    this.opponentDisconnected = false;
    this.gameService.startMatch().subscribe((match) => (this.match = match));
    this.toastService.success('Match Started', 'Match started successfully');
  }
}
