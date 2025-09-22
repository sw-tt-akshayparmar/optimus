import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, NgClass, Button],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);

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
