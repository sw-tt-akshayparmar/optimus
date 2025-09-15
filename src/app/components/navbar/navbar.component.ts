import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  AfterViewInit,
  signal,
  effect,
  WritableSignal
} from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { NgClass, NgStyle } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgClass, NgStyle, ButtonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements AfterViewInit {
  navLinks = [
    { to: '/', label: 'Home' },
    { to: '/chat', label: 'Chat' },
    { to: '/workspace', label: 'Workspace' },
  ];

  @ViewChildren('linkRef') linkRefs!: QueryList<ElementRef<HTMLAnchorElement>>;

  underlineStyle = signal<{ left: string; width: string }>({
    left: '0px',
    width: '0px',
  });

  currentUrl!: WritableSignal<string>;

  constructor(private router: Router) {
    this.currentUrl = signal(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.currentUrl.set(e.urlAfterRedirects.split('?')[0]);
        this.updateUnderline();
      });

    // reactive underline update when url changes
    effect(() => this.updateUnderline());
  }

  ngAfterViewInit() {
    this.updateUnderline();
  }

  private updateUnderline() {
    const activeIdx = this.navLinks.findIndex(
      l => l.to === this.currentUrl()
    );
    const activeRef = this.linkRefs.get(activeIdx);
    if (activeRef) {
      const rect = activeRef.nativeElement.getBoundingClientRect();
      const parentRect =
        activeRef.nativeElement.parentElement?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        this.underlineStyle.set({
          left: `${ rect.left - parentRect.left }px`,
          width: `${ rect.width }px`,
        });
      }
    }
  }
}
