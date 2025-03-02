import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agents, SaleReports } from '../core/service.types';

export abstract class DataAbstractService {

  public abstract getAgents(): Observable<Agents>;

  public abstract getSaleReports(): Observable<SaleReports>;
  
}

@Injectable()
export class DataService extends DataAbstractService {

  constructor(private http: HttpClient) {
    super();
   }

  public getAgents(): Observable<Agents> {
    return this.http.get<Agents>('/assets/data/agents.json');
  }

  public getSaleReports(): Observable<SaleReports> {
    return this.http.get<SaleReports>('/assets/data/salereports.json');
  }
}
