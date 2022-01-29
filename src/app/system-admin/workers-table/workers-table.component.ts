import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ManagerService } from 'src/app/services/manager.service';
import { UserTableInfo } from 'src/app/unregistered/models/user-table-info.model';
import { UserIdAndType } from '../../unregistered/models/user-id-and-type.model';

@Component({
  selector: 'app-workers-table',
  templateUrl: './workers-table.component.html',
  styleUrls: ['./workers-table.component.scss']
})
export class WorkersTableComponent implements OnInit {
  displayedColumns: string[];
  @Input()
  dataSource: MatTableDataSource<UserTableInfo>;
  @Input()
  clickedRow: UserTableInfo | null;
  @Output() selectedRowChanged;
  @Output() deletedRow;

  constructor(private _managerService: ManagerService, private _toastr: ToastrService) {
    this.dataSource = new MatTableDataSource();
    this.clickedRow = null;
    this.selectedRowChanged = new EventEmitter<UserTableInfo>();
    this.deletedRow = new EventEmitter<boolean>();
    this.displayedColumns = ['demo-id', 'demo-name', 'demo-phone-number', 'demo-type', 'demo-delete'];
  }

  ngOnInit(): void {}

  public rowChangedEmit(row: UserTableInfo): void {
    this.clickedRow = row;
    const userIdAndType: UserIdAndType = {
      id: this.clickedRow.id,
      type: this.clickedRow.type.toUpperCase()
    }
    this.selectedRowChanged.emit(userIdAndType);
  }

  public rowDeletedEmit(row: UserTableInfo, event: any): void {
    event.stopPropagation();
    if (row.type === 'manager' || row.type === 'system_admin') {
      this._managerService.deleteRegisteredUser(row.id).subscribe(
        () => {
          this.deletedRow.emit(true);
          this._toastr.success("User is successfully deleted!");
        },
        (err) => this._toastr.error(convertResponseError(err), "Not deleted!")
      );
    } else {
      this._managerService.deleteUnregisteredUser(row.id).subscribe(
        () => {
          this.deletedRow.emit(true);
          this._toastr.success("User is successfully deleted!");
        },
        (err) => this._toastr.error(convertResponseError(err), "Not deleted!")
      );
    }
  }
}
