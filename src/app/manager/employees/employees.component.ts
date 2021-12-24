import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ManagerService } from 'src/app/services/manager.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { UserIdAndType } from 'src/app/unregistered/models/user-id-and-type.model';
import { UserTableInfo } from 'src/app/unregistered/models/user-table-info.model';
import { AddEmployeeDialogComponent } from '../add-employee-dialog/add-employee-dialog.component';
import { UnregistaredUserDetails } from '../../unregistered/models/unregistered-user-details';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  dataSource: MatTableDataSource<UserTableInfo>;
  selecteduserId: number;
  isEnabledEditing: boolean = false;
  user: UnregistaredUserDetails | null;

  detailsForm: FormGroup = new FormGroup({
    firstName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.minLength(3), Validators.maxLength(30),]),
    lastName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.minLength(3), Validators.maxLength(30),]),
    emailAddress: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.email]),
    phoneNumber: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.pattern("[0-9]{10}")]),
    salary: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    type: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    pinCode: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.minLength(4), Validators.maxLength(4),
      Validators.pattern("^[0-9]*$")]),
  });

  constructor(private _managerService: ManagerService, public validator: ValidatorService, private _toastr: ToastrService, private _dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    this.user = null;
    this.validator.setForm(this.detailsForm);
    this.selecteduserId = -1;
  }

  ngOnInit(): void {
    this._getTableData();
  }

  getDetails(data: UserIdAndType): void {
    this._managerService.getUnregisteredUserById(data.id).subscribe(
      (res) => {
        this.user = res;
        this.detailsForm.patchValue(res);
        this.selecteduserId = data.id;
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Don't exist!")
      }
    );
    this._enableFormEditing(false);
  }

  public saveChanges(): void {
    if (this.detailsForm.invalid) {
      return;
    }
    if(this.validator.compareIfModelChanged(this.user)) {
      this._enableFormEditing(false);
      return;
    }
    this._managerService.updateUser(this.selecteduserId, this.detailsForm).subscribe(
      () => {
        this._enableFormEditing(false);
        this._toastr.success('Details are saved successfully', 'Updated');
        this._getTableData();
      },
      (err) => {
        this._toastr.error(convertResponseError(err), 'Not updated')
      }
    );
  }

  public cancelEdit(): void {
    if (this.user != null) {
      this.detailsForm.patchValue(this.user);
      this._enableFormEditing(false);
    }
  }

  public enableEdit(): void {
    this._enableFormEditing(true);
  }

  public addEmployee(): void {
    const dialogRef = this._dialog.open(AddEmployeeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }
      this._managerService.addUser(result).subscribe(
        () => {
          this._toastr.success('New employee added to database!', 'Created');
          this._getTableData();
        },
        (err) => {
          this._toastr.error(convertResponseError(err), 'Not created!')
        }
      );
    });
  }

  private _getTableData(): void {
    this._managerService.getUnregisteredUsers().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
        const userIdAndType: UserIdAndType = {
          id: this.dataSource.data[0].id,
          type: this.dataSource.data[0].type.toUpperCase()
        }
        this.getDetails(userIdAndType);
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Don't exist!")
      }
    );
  }

  public isUserDeleted(isDeleted: boolean) {
    if (isDeleted) {
      this._getTableData();
    }
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Prolazi kroz kontrole forme da bi im postavljala atribut disabled na true ili false
   * u zavisnosti od value.
   * @param value boolean? true - Moguce je editovati kontrolu, false - nije moguce editovati kontrolu
   */
  private _enableFormEditing(value: boolean): void {
    this.isEnabledEditing = value;
    const state = this.isEnabledEditing ? 'enable' : 'disable';
    Object.keys(this.detailsForm.controls).forEach((controlName) => {
      if (controlName !== 'type') {
        this.detailsForm.controls[controlName][state](); 
      }
    });
  }
}
