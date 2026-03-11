import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import APIConfig from '../config/api.config';
import { CryptoService } from './crypto.service';
import { CryptoKeyDbService } from './crypto-key-db.service';

import { SelfKeyStoreService } from './self-key-store.service';
import { UserPublicKeyStoreService } from './user-public-key-store.service';
import { ApiService } from '../services/api.service';
import { SelfKeyPairRecord, UserPublicKeyApiRecord, UserPublicKeyRecord } from './crypto-key.model';

@Injectable({
  providedIn: 'root',
})
export class UserKeyBootstrapService {
  constructor(
    private readonly apiService: ApiService,
    private readonly cryptoService: CryptoService,
    private readonly cryptoKeyDbService: CryptoKeyDbService,
    private readonly selfKeyStoreService: SelfKeyStoreService,
    private readonly userPublicKeyStoreService: UserPublicKeyStoreService,
  ) {}

  async initialize(userId: string): Promise<void> {
    if (!userId || !this.cryptoKeyDbService.isSupported) {
      return;
    }

    await this.ensureSelfKeyPair(userId);
    await this.syncUserPublicKeys(userId);
  }

  private async ensureSelfKeyPair(userId: string): Promise<SelfKeyPairRecord> {
    const databaseExists = await this.cryptoKeyDbService.databaseExists();
    const selfKeyStoreExists = this.cryptoKeyDbService.hasTable('selfKeyPairs');
    const existingKeyPair =
      databaseExists && selfKeyStoreExists
        ? await this.selfKeyStoreService.findByUserId(userId)
        : undefined;

    if (existingKeyPair) {
      return existingKeyPair;
    }

    const keyPairRecord = await this.cryptoService.createSelfKeyPairRecord(userId);
    await this.selfKeyStoreService.save(keyPairRecord);
    await firstValueFrom(this.apiService.put(APIConfig.CRYPTO_KEY, keyPairRecord.public_key));

    return keyPairRecord;
  }

  private async syncUserPublicKeys(selfUserId: string): Promise<void> {
    const userPublicStoreExists = this.cryptoKeyDbService.hasTable('userPublicKeys');
    if (!userPublicStoreExists) {
      await this.cryptoKeyDbService.open();
    }

    const response = await firstValueFrom(this.apiService.get<unknown>(APIConfig.CRYPTO_KEY));
    const records = this.normalizePublicKeys(response.data, selfUserId);
    await this.userPublicKeyStoreService.replaceAll(records);
  }

  private normalizePublicKeys(payload: unknown, selfUserId: string): UserPublicKeyRecord[] {
    const source = this.extractCollection(payload);
    if (!Array.isArray(source)) {
      return [];
    }

    const updatedAt = new Date().toISOString();

    return source
      .map((record) => this.toUserPublicKeyRecord(record, updatedAt))
      .filter((record): record is UserPublicKeyRecord => !!record && record.user_id !== selfUserId);
  }

  private extractCollection(payload: unknown): unknown[] | undefined {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (!payload || typeof payload !== 'object') {
      return undefined;
    }

    const collectionPayload = payload as { records?: unknown[]; data?: unknown[] };
    return collectionPayload.records ?? collectionPayload.data;
  }

  private toUserPublicKeyRecord(
    payload: unknown,
    updatedAt: string,
  ): UserPublicKeyRecord | undefined {
    if (!payload || typeof payload !== 'object') {
      return undefined;
    }

    const record = payload as Partial<UserPublicKeyApiRecord> & {
      user?: { id?: string };
      key?: JsonWebKey;
      publicKey?: JsonWebKey;
    };
    const userId = record.user_id ?? record.user?.id;
    const publicKey = record.public_key ?? record.publicKey ?? record.key;

    if (!userId || !publicKey) {
      return undefined;
    }

    return {
      user_id: userId,
      public_key: publicKey,
      updated_at: updatedAt,
    };
  }
}
