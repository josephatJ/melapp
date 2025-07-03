import { Injectable, signal } from '@angular/core';
import { UserInterface } from '../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class SharedCurrentUserStateService {
  private _currentUser = signal<any>(null);
  currentUser = this._currentUser.asReadonly();

  updateCurrentUser(user: UserInterface) {
    this._currentUser.set(user);
  }
}
