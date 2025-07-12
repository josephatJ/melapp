// dashboard
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedActivitiesStateService {
  private _activityProgram = signal<any>(null);
  activityProgram = this._activityProgram.asReadonly();

  private _currentActivity = signal<any>(null);
  currentActivity = this._currentActivity.asReadonly();

  private _activities = signal<any>(null);
  activities = this._activities.asReadonly();

  updateActivities(activities: any) {
    this._activities.set(activities);
  }

  updateActivityProgram(program: any) {
    this._activityProgram.set(program);
  }

  updateCurrentActivity(activity: any) {
    this._currentActivity.set(activity);
  }
}
