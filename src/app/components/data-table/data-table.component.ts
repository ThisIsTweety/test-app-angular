import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataAbstractService, DataService } from '../../services/data.service';
import { tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SaleReports } from '../../core/service.types';

@UntilDestroy()
@Component({
  selector: 'app-data-table',
  imports: [],
  providers: [
    {
      provide: DataAbstractService,
      useClass: DataService
    }
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent implements OnInit {

  constructor(private service: DataAbstractService) {}


  ngOnInit(): void {
    this.getSaleReports();
  }

  private getSaleReports(): void {
    this.service.getSaleReports()
      .pipe(
        tap((value: SaleReports) => console.log(value)),
        untilDestroyed(this)
      )
      .subscribe();
  }
}
