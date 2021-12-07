import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportInfo } from '../reports/models/report-info.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) {}

  public getWeeklyReport(year: number, month: number): Observable<ReportInfo> {
    return this.http.get<ReportInfo>(`/report/weekly?year=${year}&month=${month}`);
  }

  public getMonthlyReport(year: number): Observable<ReportInfo> {
    return this.http.get<ReportInfo>(`/report/monthly?year=${year}`);
  }

  public getQuarterlyReport(year: number): Observable<ReportInfo> {
    return this.http.get<ReportInfo>(`/report/quarterly?year=${year}`);
  }
}
