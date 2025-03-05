import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DataAbstractService, DataService } from '../../services/data.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TableModule } from 'primeng/table';
import { Agent, EntityType, FilterType, Item, SaleReports, TableConfig } from '../../core/core.types';
import { AsyncPipe, DatePipe } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { FormControl, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

@UntilDestroy()
@Component({
  selector: 'app-data-table',
  imports: [
    TableModule,
    DatePipe,
    FormsModule,
    AsyncPipe,
    DatePickerModule,
    InputTextModule,
    SelectModule
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

  public _dateRange: Date[] = [];

  public _salesPoint: string = "";

  public _agents: EntityType[] = [];

  public _dts: EntityType[] = [];

  public _selectedAgent!: EntityType; 

  public _selectedDts!: EntityType; 

  public _tableConfig: TableConfig[] = [
    {column: "Дата отчета", field: "dateAccIn", isEditable: false},
    {column: "ID отчета", field: "id", isEditable: false},
    {column: "Валюта", field: "currency.name", isEditable: false},
    {column: "Агент", field: "agent.name", isEditable: false},
    {column: "Точка продажи", field: "pointOfSale.name", isEditable: false},
    {column: "Источник данных", field: "dts.name", isEditable: false},
    {column: "Сторно", field: "strono", isEditable: false}
  ]

  private salesPointSubject$: Subject<string> = new Subject<string>();

  private reports: Item[] = [];
  
  @ViewChildren('inputRef')
  private inputElements!: QueryList<any>;

  // todo: подумать над оптимизации фильрации без постоянного ресета
  // private filterMap: { [key in FilterType]: () => void } = {
  //   [FilterType.DATE]: this.filterDates.bind(this),
  //   [FilterType.AGENT]: this.filterAgents.bind(this),
  //   [FilterType.DTS]: this.filterDTS.bind(this),
  //   [FilterType.POINT_OF_SALE]: this.filterPoints.bind(this)
  // }

  constructor(private service: DataAbstractService) {}

  public ngOnInit(): void {
    this.getSaleReports();
    this.subscribeToSalePointField();
    this.getAgents();

  }

  public ngAfterViewInit() {
    this.subscribeToColumnChange();
  }

  public _applyFilters(): void {
    this.resetFilters();

    if (this._dateRange?.length) {
      this.filterDates();
    }

    if (this._salesPoint) {
      this.filterPoints();
    }

    if (this._selectedAgent) {
      this.filterAgents();
    }

    if (this._selectedDts) {
      this.filterDTS();
    }

  }

  public _onSalesPointChange(value: string) {
    this.salesPointSubject$.next(value);
  }

  public _editColumn(config: TableConfig) {
    const index = this._tableConfig.findIndex(col => col === config);
    if(index !== -1) {
      this._tableConfig[index] = {
        ...config,
        isEditable: !config.isEditable
      }
    }
  }

  private getSaleReports(): void {
    this.service.getSaleReports()
      .pipe(
        tap((value: SaleReports) => {
          this.reports = value.items;
          this._filteredReports$.next(value.items);
          this.getDts();
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  private getAgents(): void {
    this.service.getAgents()
      .pipe(
        tap((value: Agent) => {
          this._agents = value.agents;
        }),
        untilDestroyed(this)
      )
      .subscribe();
  }

  private subscribeToColumnChange(): void {
    this.inputElements.changes.subscribe((value) => {
      if(value.first) {
        value.first.nativeElement.focus();
      }
    });
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
    if(this._dateRange?.length) {
      this._filteredReports$.next(
          this._filteredReports$.getValue().filter((report: Item) => {
          const date: Date = new Date(report.dateAccIn);
          if (this._dateRange[1]) return date > this._dateRange[0] && date < this._dateRange[1];
          return date > this._dateRange[0];
        })
      )
    }
  }

  private filterDTS(): void {
    this._filteredReports$.next(
      this._filteredReports$.getValue().filter((report: Item) => {
        return report.dts.code === this._selectedDts.code;
      })
    )
  }

  private filterAgents(): void {
    this._filteredReports$.next(
      this._filteredReports$.getValue().filter((report: Item) => {
        return report.agent.code === this._selectedAgent.code;
      })
    )
  }

  private filterPoints(): void {
    this._filteredReports$.next(
      this._filteredReports$.getValue().filter((report: Item) => {
        const point: string = report.pointOfSale.code.toLowerCase();
        return point.includes(this._salesPoint.toLowerCase());
      })
    )
  }

  private resetFilters(): void {
    this._filteredReports$.next(this.reports);
  }

  private getDts(): void {
    this._dts = this.reports.reduce((acc: EntityType[], item: Item) => {
      if(!acc.some(existingDts => existingDts.code === item.dts.code && existingDts.name === item.dts.name)) {
        acc.push(item.dts);
      }
      
      return acc;
    }, []);
  }
}
