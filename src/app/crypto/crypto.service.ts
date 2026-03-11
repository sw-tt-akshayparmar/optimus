import { Injectable } from '@angular/core';
import { SelfKeyPairRecord } from './crypto-key.model';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  async generateECKeyPair(): Promise<CryptoKeyPair> {
    return crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256',
      },
      true,
      ['deriveKey', 'deriveBits'],
    );
  }

  async createSelfKeyPairRecord(userId: string): Promise<SelfKeyPairRecord> {
    const keyPair = await this.generateECKeyPair();
    const [publicKey, privateKey] = await Promise.all([
      crypto.subtle.exportKey('jwk', keyPair.publicKey),
      crypto.subtle.exportKey('jwk', keyPair.privateKey),
    ]);
    const timestamp = new Date().toISOString();

    return {
      user_id: userId,
      public_key: publicKey,
      private_key: privateKey,
      created_at: timestamp,
      updated_at: timestamp,
    };
  }
}
