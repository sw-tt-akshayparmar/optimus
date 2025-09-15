import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  login(data: { username: string; password: string }): Observable<any> {
    // TODO: Replace with actual HTTP call
    return of({ user: { name: data.username }, token: 'fake-token' });
  }

  register(data: { name: string; username: string; password: string }): Observable<any> {
    // TODO: Replace with actual HTTP call
    return of({ success: true });
  }
}
