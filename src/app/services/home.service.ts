import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient) {}

  getHomeData(): string {
    return 'this is Home';
  }
}
