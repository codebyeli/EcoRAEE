import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { LastRouteService } from './shared/services/last-route.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const router = this.injector.get(Router);
    const lastRouteService = this.injector.get(LastRouteService);

    if (error.message.includes('Cannot match any routes')) {
      const lastRoute = lastRouteService.getLastValidRoute();
      if (lastRoute) {
        router.navigate([lastRoute]);
      } else {
        router.navigate(['/landing']);
      }
    } else {
      console.error(error);
    }
  }
}