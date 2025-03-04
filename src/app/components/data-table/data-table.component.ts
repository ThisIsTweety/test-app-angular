import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DataAbstractService, DataService } from '../../services/data.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableModule } from 'primeng/table';
import { FilterType, Item, SaleReports } from '../../core/core.types';
import { AsyncPipe, DatePipe } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { FormControl, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@UntilDestroy()
@Component({
  selector: 'app-data-table',
  imports: [
    TableModule,
    DatePipe,
    FormsModule,
    AsyncPipe,
    DatePickerModule,
    InputTextModule 
  ],
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

  public _filteredReports$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  public dateRange: Date[] = [];

  public salesPoint: string = "";

  private salesPointSubject$: Subject<string> = new Subject<string>();

  // public agents: any[] = []; // Список агентов

  // public selectedAgent: any; // Выбранный агент

  // public dataSources = [
  //   { label: 'Источник 1', value: 1 },
  //   { label: 'Источник 2', value: 2 },
  //   { label: 'Источник 3', value: 3 }
  // ]; // Список источников данных

  // public selectedDataSource: any; // Выбранный источник данных

  private reports: Item[] = [];

  // todo: задумка на оптимизацю фильрации
  // private filterMap: { [key in FilterType]: () => void } = {
  //   [FilterType.DATE]: this.filterDates.bind(this),
  //   [FilterType.AGENT]: this.filterAgents.bind(this),
  //   [FilterType.DTS]: this.filterDTS.bind(this),
  //   [FilterType.POINT_OF_SALE]: this.filterPoints.bind(this)
  // }

  constructor(private service: DataAbstractService) {}

  ngOnInit(): void {
    this.getSaleReports();
    this.subscribeToSalePointField();
  }

  public _applyFilters(): void {
    this.resetFilters();

    if (this.dateRange?.length) {
      this.filterDates();
    }

    if (this.salesPoint) {
      this.filterPoints();
    }

  }

  public _onSalesPointChange(value: string) {
    this.salesPointSubject$.next(value);
  }

  private getSaleReports(): void {
    this.service.getSaleReports()
      .pipe(
        tap((value: SaleReports) => {
          this.reports = value.items;
          this._filteredReports$.next(value.items);
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  private subscribeToSalePointField(): void {
    this.salesPointSubject$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this._applyFilters()),
        untilDestroyed(this)
      )
      .subscribe();
  }

  private filterDates(): void {
    if(this.dateRange?.length) {
      this._filteredReports$.next(
          this._filteredReports$.getValue().filter((report: Item) => {
          const date: Date = new Date(report.dateAccIn);
          if (this.dateRange[1]) return date > this.dateRange[0] && date < this.dateRange[1];
          return date > this.dateRange[0];
        })
      )
    }
  }

  private filterDTS(): void {}

  private filterAgents(): void {}

  private filterPoints(): void {
    this._filteredReports$.next(
      this._filteredReports$.getValue().filter((report: Item) => {
        const point: string = report.pointOfSale.code.toLowerCase();
        return point.includes(this.salesPoint.toLowerCase());
      })
    )
  }

  private resetFilters(): void {
    this._filteredReports$.next(this.reports);
  }
}
