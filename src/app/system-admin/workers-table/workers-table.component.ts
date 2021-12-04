import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { UnregistaredUserTable } from '../../manager/employees/models/unregistared-user-table.model';
import { SystemAdminService } from '../services/system-admin.service';
import { UserIdAndType } from '../models/user-id-and-type.model';

@Component({
  selector: 'app-workers-table',
  templateUrl: './workers-table.component.html',
  styleUrls: ['./workers-table.component.scss']
})
export class WorkersTableComponent implements OnInit {
  displayedColumns: string[];
  dataSource: MatTableDataSource<UnregistaredUserTable>;
  clickedRow: UnregistaredUserTable | null;
  @Output() selectedRowChanged;

  constructor(private _system_admin_service: SystemAdminService, private _toastr: ToastrService) {
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
    const userIdAndType: UserIdAndType = {
      id: this.clickedRow.id,
      type: this.clickedRow.type.toUpperCase()
    }
    this.selectedRowChanged.emit(userIdAndType);
  }

  private _getTableData(): void {
    this._system_admin_service.getWorkers().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.clickedRow = this.dataSource.data[0];
        const userIdAndType: UserIdAndType = {
          id: this.clickedRow.id,
          type: this.clickedRow.type.toUpperCase()
        }
        this.selectedRowChanged.emit(userIdAndType);
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
