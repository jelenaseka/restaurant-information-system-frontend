import { Component, Input, OnInit } from '@angular/core';
import { ReportInfoItem } from '../../models/report-info-item.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @Input()
  reportInfoItems: ReportInfoItem[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
