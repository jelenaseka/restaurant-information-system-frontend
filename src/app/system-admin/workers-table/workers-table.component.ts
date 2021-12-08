import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UnregistaredUserTable } from '../../manager/employees/models/unregistared-user-table.model';
import { UserIdAndType } from '../models/user-id-and-type.model';

@Component({
  selector: 'app-workers-table',
  templateUrl: './workers-table.component.html',
  styleUrls: ['./workers-table.component.scss']
})
export class WorkersTableComponent implements OnInit {
  displayedColumns: string[];
  @Input()
  dataSource: MatTableDataSource<UnregistaredUserTable>;
  @Input()
  clickedRow: UnregistaredUserTable | null;
  @Output() selectedRowChanged;

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.clickedRow = null;
    this.selectedRowChanged = new EventEmitter<number>();
    this.displayedColumns = ['demo-id', 'demo-name', 'demo-phone-number', 'demo-type',];
  }

  ngOnInit(): void {}

  public rowChangedEmit(row: UnregistaredUserTable): void {
    this.clickedRow = row;
    const userIdAndType: UserIdAndType = {
      id: this.clickedRow.id,
      type: this.clickedRow.type.toUpperCase()
    }
    this.selectedRowChanged.emit(userIdAndType);
  }
}
