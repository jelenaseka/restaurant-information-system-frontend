import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ManagerService } from 'src/app/services/manager.service';
import { UnregistaredUserTable } from '../employees/models/unregistared-user-table.model';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss'],
})
export class EmployeesTableComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<UnregistaredUserTable>;
  clickedRow: UnregistaredUserTable | null;
  @Output() selectedRowChanged;

  constructor(private _manager_service: ManagerService, private _toastr: ToastrService) {
    this.dataSource = new MatTableDataSource();
    this.clickedRow = null;
    this.selectedRowChanged = new EventEmitter<number>();
    this.displayedColumns = [
      'demo-id',
      'demo-name',
      'demo-phone-number',
      'demo-type',
    ];
  }

  public refreshTable(): void {
    this._getTableData();
  }

  ngOnInit(): void {
    this._getTableData();
  }

  public showDetails(row: UnregistaredUserTable): void {
    this.clickedRow = row;
    this.selectedRowChanged.emit(this.clickedRow.id);
  }

  private _getTableData(): void {
    this._manager_service.getUnregisteredUsers().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.clickedRow = this.dataSource.data[0];
        this.selectedRowChanged.emit(this.clickedRow.id);
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Don't exist!")
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
