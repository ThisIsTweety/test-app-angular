import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agent, SaleReports } from '../core/core.types';

export abstract class DataAbstractService {

  public abstract getAgents(): Observable<Agent>;

  public abstract getSaleReports(): Observable<SaleReports>;
  
}

@Injectable()
export class DataService extends DataAbstractService {

  constructor(private http: HttpClient) {
    super();
   }

  public getAgents(): Observable<Agent> {
    return this.http.get<Agent>('/assets/data/agents.json');
  }

  public getSaleReports(): Observable<SaleReports> {
    return this.http.get<SaleReports>('/assets/data/salereports.json');
  }
}
