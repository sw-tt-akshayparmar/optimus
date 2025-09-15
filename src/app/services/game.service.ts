import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameService {
  startMatch(): Observable<any> {
    // TODO: Replace with actual HTTP call
    return of({ id: Math.floor(Math.random() * 10000) });
  }
}
