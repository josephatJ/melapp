import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { NgxDhis2HttpClientService } from '../../ngx-http-client/services/http-client.service';

@Injectable()
export class SystemStateService {
  private _loggingStatus$: BehaviorSubject<boolean>;
  private _timeInterval: number;
  private _waitingTime: number;

  constructor(private httpClient: NgxDhis2HttpClientService) {
    this._loggingStatus$ = new BehaviorSubject<boolean>(true);
    this._timeInterval = 30000;
    this._waitingTime = 0;
  }

  checkOnlineStatus() {
    return timer(this._waitingTime, this._timeInterval).pipe(
      switchMap(() => of(navigator.onLine)),
      tap((isOnline) => {
        if (isOnline) {
          // Set time interval to larger value if was lowered
          this._timeInterval = 30000;
          this._waitingTime = 500;
          this._checkLoginStatus(isOnline);
        } else {
          // Deduce time for the timer
          this._timeInterval = 500;
          this._waitingTime = 500;
        }
      })
    );
  }

  private _checkLoginStatus(isOnline: boolean) {
    this.pingServer().subscribe(
      (pingResult: any) => {
        if (pingResult) {
          this._loggingStatus$.next(pingResult.loggedIn);
        }
      },
      (error) => {
        if (isOnline) {
          this._loggingStatus$.next(false);
        }
      }
    );
  }

  getLoginStatus() {
    return this._loggingStatus$.asObservable();
  }

  pingServer(): Observable<any> {
    return this.httpClient.get('dhis-web-commons-stream/ping.action', {
      useRootUrl: true,
    });
  }
}
