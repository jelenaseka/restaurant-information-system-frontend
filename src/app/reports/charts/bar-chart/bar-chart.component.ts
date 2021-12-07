import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxChartComponent } from 'devextreme-angular';
import { ReportInfoItem } from '../../models/report-info-item.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @Input()
  reportInfoItems: ReportInfoItem[] = [];
  @Input()
  chartTitle: string = "Report";
  @ViewChild("targetChart", { static: false }) barChart: DxChartComponent | null = null;
  constructor() { }

  ngOnInit(): void {
  }

  public refreshChart(): void {
    this.barChart?.instance.render();
    // this.barChart?.instance.refresh();
  }
}
