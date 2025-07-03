import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedCurrentUserStateService {
  private _currentUser = signal<any>({});
  currentUser = this._currentUser.asReadonly();

  updateCurrentUser(user: any) {
    this._currentUser.set(user);
  }
}
