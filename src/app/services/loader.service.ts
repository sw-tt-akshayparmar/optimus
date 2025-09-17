import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly loaders: WritableSignal<Record<string, boolean>> = signal<
    Record<string, boolean>
  >({});

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
