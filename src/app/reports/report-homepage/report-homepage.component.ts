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
  monthlyReport: ReportInfoItem[] = [];
  quarterlyReport: ReportInfoItem[] = [];
  @ViewChild("targetChartM", { static: false }) barChartM: BarChartComponent | null = null;
  @ViewChild("targetChartQ", { static: false }) barChartQ: BarChartComponent | null = null;
  yearFormPicker: FormGroup = new FormGroup({
    year: new FormControl(this.minYear, 
      [Validators.required, Validators.min(this.minYear), Validators.max(this.maxYear)]),
  });
  constructor(private _reportService: ReportService, private _toastr: ToastrService, public validator: ValidatorService) { 
    validator.setForm(this.yearFormPicker);
  }

  ngOnInit(): void {
    this.getMonthlyReport();
    this.getQuarterlyReport();
  }

  public getMonthlyReport() {
    if (this.yearFormPicker.invalid) {
      return;
    }
    let year = this.yearFormPicker.controls["year"].value;
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
    if (this.yearFormPicker.invalid) {
      return;
    }
    let year = this.yearFormPicker.controls["year"].value;
    this._reportService.getQuarterlyReport(year).subscribe(
      (res) => {
        this.quarterlyReport = res.reportItems;
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "No recorded data!")
      }
    );
  }

  onSelectChange(event) {
    if(event.index == 0){
      console.log('Tab1 is selected!');
    } else if(event.index == 1) {
      this.barChartM?.refreshChart();
    } else{
      this.barChartQ?.refreshChart();
    }
  }
}
