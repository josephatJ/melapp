import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { primengModules } from '../../shared/primeng.modules';
import { SharedChartComponent } from '../../shared/components/shared-chart/shared-chart.component';

@Component({
  selector: 'app-chart-container',
  imports: [CommonModule, ...primengModules, SharedChartComponent],
  templateUrl: './chart-container.component.html',
  styleUrl: './chart-container.component.scss',
})
export class ChartContainerComponent implements OnInit {
  @Input() id!: string;
  @Input() dashboardItems!: any[];
  @Input() name!: string;
  ngOnInit(): void {}
}
