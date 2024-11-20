import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LastRouteService {
  private lastValidRoute: string | null = null;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.lastValidRoute = event.urlAfterRedirects;
      }
    });
  }

  getLastValidRoute(): string | null {
    return this.lastValidRoute;
  }
}