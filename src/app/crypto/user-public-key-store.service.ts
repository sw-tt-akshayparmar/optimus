import { Injectable } from '@angular/core';
import { CryptoKeyDbService } from './crypto-key-db.service';
import { UserPublicKeyRecord } from './crypto-key.model';

@Injectable({
  providedIn: 'root',
})
export class UserPublicKeyStoreService {
  constructor(private readonly cryptoKeyDbService: CryptoKeyDbService) {}

  async replaceAll(records: UserPublicKeyRecord[]): Promise<void> {
    if (!this.cryptoKeyDbService.isSupported) {
      return;
    }

    await this.cryptoKeyDbService.open();
    await this.cryptoKeyDbService.userPublicKeys.clear();

    if (records.length === 0) {
      return;
    }

    await this.cryptoKeyDbService.userPublicKeys.bulkPut(records);
  }

  async findByUserId(userId: string): Promise<UserPublicKeyRecord | undefined> {
    if (!this.cryptoKeyDbService.isSupported) {
      return undefined;
    }

    await this.cryptoKeyDbService.open();
    return this.cryptoKeyDbService.userPublicKeys.get(userId);
  }
}
