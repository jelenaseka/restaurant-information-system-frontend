import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ReportService } from 'src/app/services/report.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { ReportInfoItem } from '../models/report-info-item.model';

@Component({
  selector: 'app-report-homepage',
  templateUrl: './report-homepage.component.html',
  styleUrls: ['./report-homepage.component.scss']
})
export class ReportHomepageComponent implements OnInit {
  minYear: number = 2010;
  maxYear: number = new Date().getFullYear();
  reportInfoItems: ReportInfoItem[] = [];
  yearFormPicker: FormGroup = new FormGroup({
    year: new FormControl(this.minYear, 
      [Validators.required, Validators.min(this.minYear), Validators.max(this.maxYear)]),
  });
  constructor(private _reportService: ReportService, private _toastr: ToastrService, public validator: ValidatorService) { 
    validator.setForm(this.yearFormPicker);
  }

  ngOnInit(): void {
    this.getMonthlyReport();
  }

  public getMonthlyReport() {
    if (this.yearFormPicker.invalid) {
      return;
    }
    let year = this.yearFormPicker.controls["year"].value;
    this._reportService.getMonthlyReport(year).subscribe(
      (res) => {
        this.reportInfoItems = res.reportItems;
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "No recorded data!")
      }
    );
  }
}
