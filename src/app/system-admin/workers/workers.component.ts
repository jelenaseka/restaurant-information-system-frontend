import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { UnregistaredUserDetails } from 'src/app/manager/employees/models/unregistered-user-details';
import { ManagerService } from 'src/app/services/manager.service';
import { ValidatorService } from 'src/app/services/validator.service';
import { AddWorkerDialogComponent } from '../add-worker-dialog/add-worker-dialog.component';
import { ManagerDetails } from '../models/manager-details.model';
import { UserIdAndType } from '../models/user-id-and-type.model';
import { WorkersTableComponent } from '../workers-table/workers-table.component';

@Component({
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.scss']
})
export class WorkersComponent implements OnInit {
  selecteduserId: number;
  isEnabledEditing: boolean = false;
  unregistered: UnregistaredUserDetails | null;
  manager: ManagerDetails | null;

  @ViewChild(WorkersTableComponent)
  child:WorkersTableComponent | null;

  unregisteredForm: FormGroup = new FormGroup({
    firstName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    lastName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
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
    password: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.minLength(3), Validators.maxLength(30)]),
  });

  constructor(private _managerService: ManagerService, public validator: ValidatorService, private _toastr: ToastrService, private _dialog: MatDialog) {
    this.unregistered = null;
    this.manager = null;
    this.selecteduserId = -1;
    this.child = null;
  }

  ngOnInit(): void {}

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
      this._managerService.getManagerById(data.id).subscribe(
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
        this.child?.refreshTable();
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
    this._managerService.updateManager(this.selecteduserId, this.managerForm).subscribe(
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

  public addData(): void {
    // const dialogRef = this._dialog.open(AddWorkerDialogComponent);

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result == null) {
    //     return;
    //   }
    //   this._managerService.addUser(result).subscribe(
    //     () => {
    //       this._toastr.success('New employee added to database!', 'Created');
    //       this.child?.refreshTable();
    //     },
    //     (err) => {
    //       this._toastr.error(convertResponseError(err), 'Not created!')
    //     }
    //   );
    // });
  }

  /**
   * Prolazi kroz kontrole forme da bi im postavljala atribut disabled na true ili false
   * u zavisnosti od value.
   * @param value boolean? true - Moguce je editovati kontrolu, false - nije moguce editovati kontrolu
   */
  private _enableFormEditing(value: boolean): void {
    const state = this.isEnabledEditing ? 'disable' : 'enable';
    this.isEnabledEditing = value;
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
