import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import HRHPreset from '../hrh-presets';
import { provideHttpClient } from '@angular/common/http';
import { IndexDbServiceConfig } from './shared/modules/ngx-http-client/services/index-db.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
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
    {
      provide: IndexDbServiceConfig,
      useValue: {
        namespace: 'hrh-db',
        version: 1,
        models: {
          metadata: 'id,name,type',
          users: 'id,name,role',
          // add more table schemas as needed
        },
      },
    },
  ],
};
