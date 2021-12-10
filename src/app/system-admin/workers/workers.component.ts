import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { AddEmployeeDialogComponent } from 'src/app/manager/add-employee-dialog/add-employee-dialog.component';
import { UnregistaredUserDetails } from 'src/app/unregistered/models/unregistered-user-details';
import { AddRegisteredUserDialogComponent } from 'src/app/registered/add-registered-user-dialog/add-registered-user-dialog.component';
import { RegisteredUserDetails } from 'src/app/registered/models/registered-user-details.model';
import { ManagerService } from 'src/app/services/manager.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { UserTableInfo } from 'src/app/unregistered/models/user-table-info.model';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { UserIdAndType } from '../../unregistered/models/user-id-and-type.model';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.scss']
})
export class WorkersComponent implements OnInit {
  dataSource: MatTableDataSource<UserTableInfo>;
  clickedRow: UserTableInfo | null;
  selecteduserId: number;
  isEnabledEditing: boolean = false;
  unregistered: UnregistaredUserDetails | null;
  manager: RegisteredUserDetails | null;

  unregisteredForm: FormGroup = new FormGroup({
    firstName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.minLength(3), Validators.maxLength(30),]),
    lastName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.minLength(3), Validators.maxLength(30),]),
    emailAddress: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.email]),
    phoneNumber: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.pattern("[0-9]{10}")]),
    salary: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    type: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    pinCode: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.minLength(4), Validators.maxLength(4),
      Validators.pattern("^[0-9]*$")]),
  });

  managerForm: FormGroup = new FormGroup({
    firstName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    lastName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    emailAddress: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.email]),
    phoneNumber: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.pattern("[0-9]{10}")]),
    salary: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    type: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    username: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.minLength(3), Validators.maxLength(30)]),
  });

  constructor(private _managerService: ManagerService, public validator: ValidatorService, private _toastr: ToastrService, private _dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    this.clickedRow = null;
    this.unregistered = null;
    this.manager = null;
    this.selecteduserId = -1;
  }

  ngOnInit(): void {
    this._getTableData();
  }

  getDetails(data: UserIdAndType): void {
    if (data.type !== 'MANAGER') {
      this._managerService.getUnregisteredUserById(data.id).subscribe(
        (res) => {
          this.validator.setForm(this.unregisteredForm);
          this.unregistered = res;
          this.manager = null;
          this.unregisteredForm.patchValue(res);
          this.selecteduserId = data.id;
        },
        (err) => {
          this._toastr.error(convertResponseError(err), "Don't exist!")
        }
      );
    } else {
      this._managerService.getRegisteredUserById(data.id).subscribe(
        (res) => {
          this.validator.setForm(this.managerForm);
          this.unregistered = null;
          this.manager = res;
          this.managerForm.patchValue(res);
          this.selecteduserId = data.id;
        },
        (err) => {
          this._toastr.error(convertResponseError(err), "Don't exist!")
        }
      );
    }
    this._enableFormEditing(false);
  }

  public saveUnregistered(): void {
    if (this.unregisteredForm.invalid) {
      return;
    }
    if(this.validator.compareIfModelChanged(this.unregistered)) {
      this._enableFormEditing(false);
      return;
    }
    this._managerService.updateUser(this.selecteduserId, this.unregisteredForm).subscribe(
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

  public saveManager(): void {
    if (this.managerForm.invalid) {
      return;
    }
    if(this.validator.compareIfModelChanged(this.manager)) {
      this._enableFormEditing(false);
      return;
    }
    this._managerService.updateRegisteredUser(this.selecteduserId, this.managerForm).subscribe(
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
    if (this.unregistered != null) {
      this.unregisteredForm.patchValue(this.unregistered);
    }
    if (this.manager != null) {
      this.managerForm.patchValue(this.manager);
    }
    this._enableFormEditing(false);
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

  public addManager(): void {
    const dialogRef = this._dialog.open(AddRegisteredUserDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }
      this._managerService.addRegisteredUser(result, 'MANAGER').subscribe(
        () => {
          this._toastr.success('New manager added to database!', 'Created');
          this._getTableData();
        },
        (err) => {
          this._toastr.error(convertResponseError(err), 'Not created!')
        }
      );
    });
  }

  public changePassword(): void {
    const dialogRef = this._dialog.open(ChangePasswordDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }
      this._managerService.changePassword(this.selecteduserId, result).subscribe(
        () => {
          this._toastr.success('Password is changed!', 'Updated');
        },
        (err) => {
          this._toastr.error(convertResponseError(err), 'Not updated!')
        }
      );
    });
  }

  private _getTableData(): void {
    this._managerService.getWorkers().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.clickedRow = this.dataSource.data[0];
        const userIdAndType: UserIdAndType = {
          id: this.clickedRow.id,
          type: this.clickedRow.type.toUpperCase()
        }
        this.getDetails(userIdAndType);
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Don't exist!")
      }
    );
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
    if (this.unregistered != null) {
      Object.keys(this.unregisteredForm.controls).forEach((controlName) => {
        if (controlName !== 'type') {
          this.unregisteredForm.controls[controlName][state](); 
        }
      });
    } else {
      Object.keys(this.managerForm.controls).forEach((controlName) => {
        if (controlName !== 'type') {
          this.managerForm.controls[controlName][state](); 
        }
      });
    }
  }
}
