import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ManagerService } from 'src/app/services/manager.service';
import { UnregistaredUserDetails } from './models/unregistered-user-details';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  isEnabledEditing: boolean = false;
  user: UnregistaredUserDetails | null;
  detailsForm: FormGroup = new FormGroup({
    firstName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    lastName: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    emailAddress: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    phoneNumber: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    salary: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    type: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
    pinCode: new FormControl({ value: '', disabled: !this.isEnabledEditing }, [Validators.required,]),
  });

  constructor(private _manager_service: ManagerService) {
    this.user = null;
  }

  ngOnInit(): void {}

  getDetails(id: number): void {
    this._manager_service.getUnregisteredUserById(id).subscribe(
      (res) => {
        this.user = res;
        this.detailsForm.patchValue(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public editUser(): void {
    console.log(this.user);
  }

  public cancelEdit(): void {
    if (this.user != null) {
      this.detailsForm.patchValue(this.user);
      const state = this.isEnabledEditing ? 'disable' : 'enable';
      this.isEnabledEditing = false;
      Object.keys(this.detailsForm.controls).forEach((controlName) => {
        this.detailsForm.controls[controlName][state](); 
      });
    }
  }

  public enableEdit(): void {
    const state = this.isEnabledEditing ? 'disable' : 'enable';
    this.isEnabledEditing = true;
    Object.keys(this.detailsForm.controls).forEach((controlName) => {
      this.detailsForm.controls[controlName][state](); 
  });
  }
}
