import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MenuNotificationService {
  constructor(private httpClient: HttpClient) {}

  loadNotification(rootUrl: string): Observable<any> {
    return this.httpClient
      .get(`${rootUrl}api/me/dashboard.json`)
      .pipe(catchError(() => of(null)));
  }
}
