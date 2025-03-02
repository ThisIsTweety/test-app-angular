import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'report', loadComponent: () => import('./components/report/report.component').then(c => c.ReportComponent)},
    {path: 'data-table', loadComponent: () => import('./components/data-table/data-table.component').then(c => c.DataTableComponent)},
    {path: '**', redirectTo: ''}
];
