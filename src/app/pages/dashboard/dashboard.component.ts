import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SharedCurrentUserStateService } from '../../shared/resources/services/current-user.service';
import { DashboardContainerComponent } from '../../containers/dashboard-container/dashboard-container.component';
import { DashboardStateService } from '../../shared/resources/services/dashboard/dashboards.state.service';
import { NgxDhis2HttpClientService } from '../../shared/modules/ngx-http-client/services/http-client.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, DashboardContainerComponent, ProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private userState = inject(SharedCurrentUserStateService);
  private dashboardsState = inject(DashboardStateService);
  private httpClientService = inject(NgxDhis2HttpClientService);
  currentUser = this.userState.currentUser;
  dashboards = this.dashboardsState.dashboards;

  ngOnInit(): void {
    if (this.dashboards().length === 0) {
      this.httpClientService
        .get(
          'dashboards.json?fields=id,name,code,dashboardItems[*,visualization[*]]'
        )
        .subscribe({
          next: (dashboardsResponse) => {
            this.dashboardsState.updateDashboards(
              dashboardsResponse?.dashboards
            );
          },
          error: (err) => {
            console.error('Failed to fetch dashboards:', err);
          },
        });
    }
  }
}
