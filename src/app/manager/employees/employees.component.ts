import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ManagerService } from 'src/app/services/manager.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AddEmployeeDialogComponent } from '../add-employee-dialog/add-employee-dialog.component';
import { EmployeesTableComponent } from '../employees-table/employees-table.component';
import { UnregistaredUserDetails } from './models/unregistered-user-details';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  selecteduserId: number;
  isEnabledEditing: boolean = false;
  user: UnregistaredUserDetails | null;

  @ViewChild(EmployeesTableComponent)
  child:EmployeesTableComponent | null;

  detailsForm: FormGroup = new FormGroup({
    firstName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    lastName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    emailAddress: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.email]),
    phoneNumber: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.pattern("[0-9]{10}")]),
    salary: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    type: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    pinCode: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required, Validators.minLength(4), Validators.maxLength(4),
      Validators.pattern("^[0-9]*$")]),
  });

  constructor(private _managerService: ManagerService, public validator: ValidatorService, private _toastr: ToastrService, private _dialog: MatDialog) {
    this.user = null;
    this.validator.setForm(this.detailsForm);
    this.selecteduserId = -1;
    this.child = null;
  }

  ngOnInit(): void {}

  getDetails(id: number): void {
    this._managerService.getUnregisteredUserById(id).subscribe(
      (res) => {
        this.user = res;
        this.detailsForm.patchValue(res);
        this.selecteduserId = id;
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Don't exist!")
      }
    );
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
        this.child?.refreshTable();
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

  public addData(): void {
    const dialogRef = this._dialog.open(AddEmployeeDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        return;
      }
      this._managerService.addUser(result).subscribe(
        () => {
          this._toastr.success('New employee added to database!', 'Created');
          this.child?.refreshTable();
        },
        (err) => {
          this._toastr.error(convertResponseError(err), 'Not created!')
        }
      );
    });
  }

  /**
   * Prolazi kroz kontrole forme da bi im postavljala atribut disabled na true ili false
   * u zavisnosti od value.
   * @param value boolean? true - Moguce je editovati kontrolu, false - nije moguce editovati kontrolu
   */
  private _enableFormEditing(value: boolean): void {
    const state = this.isEnabledEditing ? 'disable' : 'enable';
    this.isEnabledEditing = value;
    Object.keys(this.detailsForm.controls).forEach((controlName) => {
      if (controlName !== 'type') {
        this.detailsForm.controls[controlName][state](); 
      }
    });
  }
}
