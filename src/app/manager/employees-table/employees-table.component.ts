import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ManagerService } from 'src/app/services/manager.service';
import { UnregistaredUserTable } from '../employees/models/unregistared-user-table.model';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss'],
})
export class EmployeesTableComponent implements OnInit {
  displayedColumns: string[];
  dataSource: UnregistaredUserTable[];
  clickedRow: UnregistaredUserTable | null;
  @Output() selectedRowChanged;

  constructor(private _manager_service: ManagerService) {
    this.dataSource = [];
    this.clickedRow = null;
    this.selectedRowChanged = new EventEmitter<number>();
    this.displayedColumns = [
      'demo-id',
      'demo-name',
      'demo-phone-number',
      'demo-type',
    ];
  }

  ngOnInit(): void {
    this._manager_service.getUnregisteredUsers().subscribe(
      (res) => {
        this.dataSource = res;
        this.clickedRow = this.dataSource[0];
        this.selectedRowChanged.emit(this.clickedRow.id);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public showDetails(row: UnregistaredUserTable): void {
    this.clickedRow = row;
    this.selectedRowChanged.emit(this.clickedRow.id);
  }
}
