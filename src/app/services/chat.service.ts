import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private messages$ = new Subject<{ user: string; message: string }>();

  sendMessage(user: string, message: string) {
    this.messages$.next({ user, message });
  }

  getMessages(): Observable<{ user: string; message: string }> {
    return this.messages$.asObservable();
  }
}
