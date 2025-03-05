import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DataAbstractService, DataService } from '../../services/data.service';
import { tap } from 'rxjs';
import { Item, SaleReports } from '../../core/core.types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChartModule } from 'primeng/chart';
import { isPlatformBrowser } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'app-report',
  imports: [
    ChartModule,
  ],
  providers: [
    {
      provide: DataAbstractService,
      useClass: DataService
    }
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {

  public basicData: any;

  public basicOptions: any;

  private reports: Item[] = [];

  private platformId = inject(PLATFORM_ID);
  
  constructor(private service: DataAbstractService,
              private cd: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.getSaleReports();
    
  }

  private getSaleReports(): void {
    this.service.getSaleReports()
      .pipe(
        tap((value: SaleReports) => {
          this.reports = value.items;
          this.initChart();
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  private initChart() {
    if (isPlatformBrowser(this.platformId)) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');


        const groupData = this.reports.reduce((acc, item) => {
          const date: string = item.dateAccIn.slice(0, 10);
          if(acc[date]) {
            acc[date]++;
          } else {
            acc[date] = 1;
          }

          return acc;
        }, {} as { [key: string]: number })

        this.basicData = {
            labels: Object.keys(groupData),
            datasets: [
                {
                    label: 'Reports',
                    data: Object.values(groupData),
                    backgroundColor: [
                        'rgba(249, 115, 22, 0.2)',
                        'rgba(6, 182, 212, 0.2)',
                        'rgb(107, 114, 128, 0.2)',
                        'rgba(139, 92, 246, 0.2)',
                    ],
                    borderColor: ['rgb(249, 115, 22)', 'rgb(6, 182, 212)', 'rgb(107, 114, 128)', 'rgb(139, 92, 246)'],
                    borderWidth: 1,
                },
            ],
        };

        this.basicOptions = {
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
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };
        this.cd.markForCheck()
    }
}
}
