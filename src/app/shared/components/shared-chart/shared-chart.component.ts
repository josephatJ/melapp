import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-shared-chart',
  imports: [CommonModule, CardModule, ChartModule],
  templateUrl: './shared-chart.component.html',
  styleUrl: './shared-chart.component.scss',
})
export class SharedChartComponent implements OnInit {
  @Input() dashboardItem: any;
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  constructor(private cd: ChangeDetectorRef) {}

  themeEffect = effect(() => {
    this.initChart();
  });

  ngOnInit() {
    this.initChart();
    console.log(this.dashboardItem);
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--p-text-muted-color'
      );
      const surfaceBorder = documentStyle.getPropertyValue(
        '--p-content-border-color'
      );
      if (this.dashboardItem?.visualization?.type === 'LINE') {
        this.data = {
          labels: ['A', 'B', 'C'],
          datasets: [
            {
              data: [300, 50, 100],
              backgroundColor: [
                documentStyle.getPropertyValue('--p-cyan-500'),
                documentStyle.getPropertyValue('--p-orange-500'),
                documentStyle.getPropertyValue('--p-gray-500'),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue('--p-cyan-400'),
                documentStyle.getPropertyValue('--p-orange-400'),
                documentStyle.getPropertyValue('--p-gray-400'),
              ],
            },
          ],
        };
        this.options = {
          cutout: '60%',
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
        };
      } else {
        this.data = {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
          ],
          datasets: [
            {
              label: 'Sample 1 dataset',
              backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
              borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
              data: [65, 59, 80, 81, 56, 55, 40],
            },
            {
              label: 'Sample 2 dataset',
              backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
              borderColor: documentStyle.getPropertyValue('--p-gray-500'),
              data: [28, 48, 40, 19, 86, 27, 90],
            },
          ],
        };

        this.options = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                color: textColor,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary,
                font: {
                  weight: 500,
                },
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
            y: {
              ticks: {
                color: textColorSecondary,
              },
              grid: {
                color: surfaceBorder,
                drawBorder: false,
              },
            },
          },
        };
      }
      this.cd.markForCheck();
    }
  }
}
