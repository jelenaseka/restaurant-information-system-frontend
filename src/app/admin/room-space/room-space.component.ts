import { Component, Input, OnInit } from '@angular/core';
import { Table } from '../model/table.model';

@Component({
  selector: 'app-room-space',
  templateUrl: './room-space.component.html',
  styleUrls: ['./room-space.component.scss']
})
export class RoomSpaceComponent implements OnInit {

  @Input()
  tables :  Table[] = [];
  @Input()
  row :  number = -1;
  @Input()
  column :  number = -1;

  table : Table | undefined;

  constructor() { }

  ngOnInit(): void {
    this.tables.forEach(table => {
      if(table.row === this.row && table.column === this.column) {
        this.table = table;
      }
    });
  }

}
