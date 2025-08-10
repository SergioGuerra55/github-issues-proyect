import { Component, inject, effect } from '@angular/core';
import { Login, Dashboard } from '@github-issues-manager/ui';
import { AuthStore } from '@github-issues-manager/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Login, Dashboard],
  template: `
    @if (authStore.user()) {
      <lib-dashboard></lib-dashboard>
    } @else {
      <lib-login></lib-login>
    }
  `,
  styleUrl: './app.css'
})
export class App {
  authStore = inject(AuthStore);
  title = 'GitHub Issues Manager';
}