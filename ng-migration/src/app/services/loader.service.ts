import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loading$ = new BehaviorSubject<boolean>(false);

  enable() {
    this.loading$.next(true);
  }

  disable() {
    this.loading$.next(false);
  }

  isLoading() {
    return this.loading$.asObservable();
  }
}
