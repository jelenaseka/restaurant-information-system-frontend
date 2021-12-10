import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { AddEmployeeDialogComponent } from 'src/app/manager/add-employee-dialog/add-employee-dialog.component';
import { UnregistaredUserTable } from 'src/app/manager/employees/models/unregistared-user-table.model';
import { UnregistaredUserDetails } from 'src/app/manager/employees/models/unregistered-user-details';
import { ManagerService } from 'src/app/services/manager.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AddManagerDialogComponent } from 'src/app/system-admin/add-manager-dialog/add-manager-dialog.component';
import { ChangePasswordDialogComponent } from 'src/app/system-admin/change-password-dialog/change-password-dialog.component';
import { ManagerDetails } from 'src/app/system-admin/models/manager-details.model';
import { UserIdAndType } from 'src/app/system-admin/models/user-id-and-type.model';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrls: ['./administrators.component.scss']
})
export class AdministratorsComponent implements OnInit {
  //TODO: Preimenovati UnregistaredUserTable
  dataSource: MatTableDataSource<UnregistaredUserTable>;
  selecteduserId: number = -1;
  isEnabledEditing: boolean = false;
  system_admin: ManagerDetails | null = null;

  form: FormGroup = new FormGroup({
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
    this.validator.setForm(this.form);
  }

  ngOnInit(): void {
    this._getTableData();
  }

  getDetails(data: UserIdAndType): void {
    this._managerService.getManagerById(data.id).subscribe(
      (res) => {
        this.system_admin = res;
        this.form.patchValue(res);
        this.selecteduserId = data.id;
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Don't exist!")
      }
    );
    this._enableFormEditing(false);
  }

  public saveSystemAdmin(): void {
    if (this.form.invalid) {
      return;
    }
    if(this.validator.compareIfModelChanged(this.system_admin)) {
      this._enableFormEditing(false);
      return;
    }
    this._managerService.updateManager(this.selecteduserId, this.form).subscribe(
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
    if (this.system_admin != null) {
      this.form.patchValue(this.system_admin);
      this._enableFormEditing(false);
    }
  }

  public enableEdit(): void {
    this._enableFormEditing(true);
  }

  public addSystemAdmin(): void {
    const dialogRef = this._dialog.open(AddManagerDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }
      this._managerService.addRegisteredUser(result, 'SYSTEM_ADMIN').subscribe(
        () => {
          this._toastr.success('New system admin added to database!', 'Created');
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
    this._managerService.getSystemAdmins().subscribe(
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
    Object.keys(this.form.controls).forEach((controlName) => {
      if (controlName !== 'type') {
        this.form.controls[controlName][state](); 
      }
    });
  }
}
