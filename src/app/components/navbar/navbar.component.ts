import { Component, inject } from '@angular/core';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, NgClass, MatButton, MatIcon],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  protected router = inject(Router);

  navLinks = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Chat' },
    { to: '/workspace', label: 'Workspace' },
  ];

  isActive(link: string) {
    return this.router.isActive(link, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
