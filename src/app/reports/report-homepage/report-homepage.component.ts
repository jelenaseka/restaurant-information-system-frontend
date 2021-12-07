import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ReportService } from 'src/app/services/report.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
import { ReportInfoItem } from '../models/report-info-item.model';

@Component({
  selector: 'app-report-homepage',
  templateUrl: './report-homepage.component.html',
  styleUrls: ['./report-homepage.component.scss']
})
export class ReportHomepageComponent implements OnInit {
  minYear: number = 2010;
  maxYear: number = new Date().getFullYear();
  minMonth: number = 1;
  maxMonth: number = 12;

  weeklyReport: ReportInfoItem[] = [];
  monthlyReport: ReportInfoItem[] = [];
  quarterlyReport: ReportInfoItem[] = [];

  @ViewChild("targetChartW", { static: false }) barChartW: BarChartComponent | null = null;
  @ViewChild("targetChartM", { static: false }) barChartM: BarChartComponent | null = null;
  @ViewChild("targetChartQ", { static: false }) barChartQ: BarChartComponent | null = null;

  weeklyForm: FormGroup = new FormGroup({
    year: new FormControl(this.maxYear, 
      [Validators.required, Validators.min(this.minYear), Validators.max(this.maxYear)]),
    month: new FormControl(this.minMonth, 
      [Validators.required, Validators.min(this.minMonth), Validators.max(this.maxMonth)]),
  });
  monthlyForm: FormGroup = new FormGroup({
    year: new FormControl(this.maxYear, 
      [Validators.required, Validators.min(this.minYear), Validators.max(this.maxYear)]),
  });
  quarterlyForm: FormGroup = new FormGroup({
    year: new FormControl(this.maxYear, 
      [Validators.required, Validators.min(this.minYear), Validators.max(this.maxYear)]),
  });

  constructor(private _reportService: ReportService, private _toastr: ToastrService, public validator: ValidatorService) { 
    validator.setForm(this.weeklyForm);
  }

  ngOnInit(): void {
    this.getWeeklyReport();
  }

  public getWeeklyReport() {
    if (this.weeklyForm.invalid) {
      return;
    }
    let year = this.weeklyForm.controls["year"].value;
    let month = this.weeklyForm.controls["month"].value;
    this._reportService.getWeeklyReport(year, month).subscribe(
      (res) => {
        this.weeklyReport = res.reportItems;
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "No recorded data!")
      }
    );
  }

  public getMonthlyReport() {
    if (this.monthlyForm.invalid) {
      return;
    }
    let year = this.monthlyForm.controls["year"].value;
    this._reportService.getMonthlyReport(year).subscribe(
      (res) => {
        this.monthlyReport = res.reportItems;
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "No recorded data!")
      }
    );
  }

  public getQuarterlyReport() {
    if (this.quarterlyForm.invalid) {
      return;
    }
    let year = this.quarterlyForm.controls["year"].value;
    this._reportService.getQuarterlyReport(year).subscribe(
      (res) => {
        this.quarterlyReport = res.reportItems;
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "No recorded data!")
      }
    );
  }

  public onSelectChange(event): void {
    if(event.index == 0){
      this._refreshTab(this.barChartW, this.weeklyForm);
      this.getWeeklyReport();
    } else if(event.index == 1) {
      this._refreshTab(this.barChartM, this.monthlyForm);
      this.getMonthlyReport();
    } else{
      this._refreshTab(this.barChartQ, this.quarterlyForm);
      this.getQuarterlyReport();
    }
  }

  /**
   * After changing the tab, refresh proper form and redraw the chart.
   * 
   * @param barChart : BarChartComponent | null
   * @param form : FormGroup
   */
  private _refreshTab(barChart: BarChartComponent | null, form: FormGroup): void {
    barChart?.refreshChart();
    this.validator.setForm(form);
    form.controls["year"].setValue(this.maxYear);
    if (form == this.weeklyForm) {
      form.controls["month"].setValue(this.minMonth);
    }
  }
}
