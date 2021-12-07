import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxChartComponent } from 'devextreme-angular';
import { ReportInfoItem } from '../../models/report-info-item.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  types: string[] = ['line', 'stackedline', 'fullstackedline'];
  
  @Input()
  reportInfoItems: ReportInfoItem[] = [];
  @Input()
  chartTitle: string = "Report";
  @ViewChild("targetLineChart", { static: false }) lineChart: DxChartComponent | null = null;
  constructor() { }

  ngOnInit(): void {
  }
  
  public refreshChart(): void {
    this.lineChart?.instance.render();
  }
}
