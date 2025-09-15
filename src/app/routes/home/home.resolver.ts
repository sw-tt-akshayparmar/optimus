import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeService } from '../../services/home.service';

@Injectable({ providedIn: 'root' })
export class HomeResolver implements Resolve<any> {
  constructor(private homeService: HomeService) {}

  resolve(): string {
    return this.homeService.getHomeData();
  }
}
