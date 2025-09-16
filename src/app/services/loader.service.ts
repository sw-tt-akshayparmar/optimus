import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderStore {
  // key-value map of loader flags
  private readonly loaders: WritableSignal<Record<string, boolean>> = signal<
    Record<string, boolean>
  >({});

  // expose as readonly
  readonly state = this.loaders.asReadonly();

  enable(key: string) {
    this.loaders.update((curr) => ({ ...curr, [key]: true }));
  }

  disable(key: string) {
    this.loaders.update((curr) => ({ ...curr, [key]: false }));
  }

  isLoading(key: string) {
    return this.loaders()[key] ?? false;
  }
}
