import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ButtonModule, RouterLinkActive, NgClass],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);

  navLinks = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Chat' },
    { to: '/workspace', label: 'Workspace' },
  ];

  // underline position state
  underlineStyle = signal<{ left: string; width: string }>({ left: '0px', width: '0px' });

  updateUnderline(el: any) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    this.underlineStyle.set({ left: `${ rect.left }px`, width: `${ rect.width }px` });
  }

  isActive(link: string) {
    return this.router.isActive(link, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}
