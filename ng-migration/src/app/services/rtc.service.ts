import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RTCService {
  private register$ = new Subject<string>();
  private receive$ = new Subject<{ user: string; message: string }>();

  register(user: string) {
    this.register$.next(user);
  }

  onRegister(): Observable<string> {
    return this.register$.asObservable();
  }

  send(user: string, message: string) {
    this.receive$.next({ user, message });
  }

  onReceive(): Observable<{ user: string; message: string }> {
    return this.receive$.asObservable();
  }
}
