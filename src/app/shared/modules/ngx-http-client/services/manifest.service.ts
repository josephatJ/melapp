import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Manifest } from '../models/manifest.model';

@Injectable({ providedIn: 'root' })
export class ManifestService {
  getManifest(httpClient: HttpClient): Observable<Manifest> {
    return of({
      version: '1.0.0',
      name: 'DHIS2 Custom App',
      description: 'DHIS2 Custom App',
      appType: 'APP',
      launch_path: 'index.html',
      icons: {
        '16': 'assets/icons/icon-16x16.png',
        '48': 'assets/icons/icon-48x48.png',
        '128': 'assets/icons/icon-128x128.png',
      },
      developer: {
        name: 'Josephat Julius',
        email: 'josephatjulius24@gmail.com',
      },
      default_locale: 'en',
      activities: {
        dhis: {
          href: '../../../',
        },
      },
      authorities: [],
    });
    // return httpClient.get<Manifest>('manifest.webapp').pipe(
    //   catchError(() => {
    //     console.warn(
    //       'Manifest file could not be loaded, default options have been used instead'
    //     );
    //     return of();
    //   })
    // );
  }
}
