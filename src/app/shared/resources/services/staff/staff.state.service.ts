import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedStaffStateService {
  private _staff = signal<any>(null);
  staff = this._staff.asReadonly();

  updateStaffDetails(staff: any) {
    this._staff.set(staff);
  }
}
