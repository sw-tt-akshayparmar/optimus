import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient) {}

  getHomeData(): string {
    // return this.http.get('/api/home');
    return 'this is Home';
  }
}
