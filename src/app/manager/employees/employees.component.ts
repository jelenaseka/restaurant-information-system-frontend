import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  number: number;
  type: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', number: 1.0079, type: 'H' },
  { position: 2, name: 'Helium', number: 4.0026, type: 'He' },
  { position: 3, name: 'Lithium', number: 6.941, type: 'Li' },
];

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = [
    'demo-position',
    'demo-name',
    'demo-number',
    'demo-type',
  ];
  dataSource = ELEMENT_DATA;
  constructor() {}

  ngOnInit(): void {}
}
