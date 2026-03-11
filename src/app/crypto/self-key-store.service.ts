import { Injectable } from '@angular/core';
import { CryptoKeyDbService } from './crypto-key-db.service';
import { SelfKeyPairRecord } from './crypto-key.model';

@Injectable({
  providedIn: 'root',
})
export class SelfKeyStoreService {
  constructor(private readonly cryptoKeyDbService: CryptoKeyDbService) {}

  async findByUserId(userId: string): Promise<SelfKeyPairRecord | undefined> {
    if (!this.cryptoKeyDbService.isSupported) {
      return undefined;
    }

    await this.cryptoKeyDbService.open();
    return this.cryptoKeyDbService.selfKeyPairs.get(userId);
  }

  async save(record: SelfKeyPairRecord): Promise<void> {
    if (!this.cryptoKeyDbService.isSupported) {
      return;
    }

    await this.cryptoKeyDbService.open();
    await this.cryptoKeyDbService.selfKeyPairs.put(record);
  }
}
