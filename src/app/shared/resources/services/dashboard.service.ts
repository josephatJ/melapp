// dashboard
import { Injectable, signal } from '@angular/core';
import { UserInterface } from '../../models/user.models';

@Injectable({
  providedIn: 'root',
})
export class SharedMessageSummaryStateService {
  private _unreadInformation = signal<{
    unreadInterpretations: number;
    unreadMessageConversations: number;
  }>({ unreadInterpretations: 0, unreadMessageConversations: 0 });
  unreadInformation = this._unreadInformation.asReadonly();

  updateMessagesData(info: any) {
    this._unreadInformation.set(info);
  }
}
