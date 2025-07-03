import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SystemInfo } from '../models/system-info.model';

@Injectable({ providedIn: 'root' })
export class SystemInfoService {
  get(httpClient: HttpClient, rootUrl: string): Observable<SystemInfo> {
    return forkJoin(
      httpClient.get(`${rootUrl}api/system/info`),
      httpClient.get(`${rootUrl}api/systemSettings`)
    ).pipe(
      map((res: any[]) => {
        return { ...res[0], ...res[1] };
      }),
      catchError((error: any) => {
        console.log(error);
        return of(error);
      })
    );
  }
}
