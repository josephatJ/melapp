import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardStateService {
  private _dashboards = signal<any>(null);
  private _defaultDashboards = signal<any>(null);
  dashboards = this._dashboards.asReadonly();
  defaultDashboards = this._defaultDashboards.asReadonly();

  updateDashboards(dashboards: any[]) {
    this._dashboards.set(dashboards);
  }

  updateDefaultDashboards(dashboards: any[]) {
    this._defaultDashboards.set(dashboards);
  }
}
