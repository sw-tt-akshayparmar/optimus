import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Dexie, { Table } from 'dexie';
import { SelfKeyPairRecord, UserPublicKeyRecord } from './crypto-key.model';

const KEY_DATABASE_NAME = 'crypto-keys';

type CryptoKeyTableName = 'selfKeyPairs' | 'userPublicKeys';

class CryptoKeyDatabase extends Dexie {
  selfKeyPairs!: Table<SelfKeyPairRecord, string>;
  userPublicKeys!: Table<UserPublicKeyRecord, string>;

  constructor() {
    super(KEY_DATABASE_NAME);
    this.version(1).stores({
      selfKeyPairs: 'user_id, updated_at',
      userPublicKeys: 'user_id, updated_at',
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class CryptoKeyDbService {
  private readonly platformId = inject(PLATFORM_ID);
  private database?: CryptoKeyDatabase;

  get databaseName(): string {
    return KEY_DATABASE_NAME;
  }

  get isSupported(): boolean {
    return isPlatformBrowser(this.platformId) && typeof indexedDB !== 'undefined';
  }

  async databaseExists(): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    return Dexie.exists(KEY_DATABASE_NAME);
  }

  hasTable(tableName: CryptoKeyTableName): boolean {
    if (!this.isSupported) {
      return false;
    }

    return this.getDatabase().tables.some((table) => table.name === tableName);
  }

  get selfKeyPairs(): Table<SelfKeyPairRecord, string> {
    return this.getDatabase().selfKeyPairs;
  }

  get userPublicKeys(): Table<UserPublicKeyRecord, string> {
    return this.getDatabase().userPublicKeys;
  }

  async open(): Promise<void> {
    if (!this.isSupported) {
      return;
    }

    await this.getDatabase().open();
  }

  private getDatabase(): CryptoKeyDatabase {
    if (!this.isSupported) {
      throw new Error('IndexedDB is not available in the current environment.');
    }

    this.database ??= new CryptoKeyDatabase();
    return this.database;
  }
}
