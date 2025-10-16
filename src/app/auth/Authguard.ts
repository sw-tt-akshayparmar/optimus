import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | boolean {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.userService.getUserData();
      if (!user) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
      return true;
    }
    return true;
  }
}
