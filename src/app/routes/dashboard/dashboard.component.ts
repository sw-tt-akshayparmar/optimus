import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import APIConfig from '../../config/api.config';
import { CryptoService } from '../../crypto/crypto.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly apiService: ApiService,
  ) {}

  async sendKey() {
    const key = await this.cryptoService.generateECKeyPair();
    const pub = await window.crypto.subtle.exportKey('jwk', key.publicKey);
    this.apiService.put(APIConfig.CRYPTO_KEY, pub).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
