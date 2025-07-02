import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import HRHPreset from '../hrh-presets';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: HRHPreset,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
  ],
};
