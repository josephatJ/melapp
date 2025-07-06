import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ChartContainerComponent } from '../../components/chart-container/chart-container.component';
import { RouterModule } from '@angular/router';
import { primengModules } from '../../shared/primeng.modules';

@Component({
  selector: 'app-dashboard-container',
  imports: [
    CommonModule,
    RouterModule,
    ...primengModules,
    ChartContainerComponent,
  ],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss',
})
export class DashboardContainerComponent implements OnInit {
  @Input() dashboards!: any[];
  activeIndex: string = 'default1';

  ngOnInit(): void {
    this.activeIndex = this.dashboards[0]?.id;
  }
}
