import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    @if (!isAuthPage()) {
      <app-navbar></app-navbar>
    }

    <router-outlet></router-outlet>
  `
})
export class AppComponent {

  constructor(private router: Router) {}

  isAuthPage() {
    return this.router.url === '/login' ||
           this.router.url === '/register';
  }
}