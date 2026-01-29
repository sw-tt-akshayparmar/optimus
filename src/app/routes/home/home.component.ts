import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [],
})
export class HomeComponent {
  match: any = null;
  opponentDisconnected = false;

  constructor() {}

  handleStartMatch() {
    this.opponentDisconnected = false;
  }
}
