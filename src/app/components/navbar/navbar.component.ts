import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterModule, isActive } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, MatButton, MatIcon],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    protected readonly userService: UserService,
    protected readonly router: Router,
  ) {}

  navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/chat', label: 'Chat' },
    { to: '/workspace', label: 'Workspace' },
    { to: '/ai', label: 'AI' },
  ];

  isActive(link: string) {
    return isActive(link, this.router, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  login() {
    this.router.navigate(['login']);
  }
  register() {
    this.router.navigate(['register']);
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }
}
