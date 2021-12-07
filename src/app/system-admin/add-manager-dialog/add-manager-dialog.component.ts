import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-add-manager-dialog',
  templateUrl: './add-manager-dialog.component.html',
  styleUrls: ['./add-manager-dialog.component.scss']
})
export class AddManagerDialogComponent implements OnInit {
  hideNew: boolean = true;
  hideRepeat: boolean = true;

  managerForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required,]),
    lastName: new FormControl('', [Validators.required,]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{10}")]),
    salary: new FormControl('', [Validators.required,]),
    type: new FormControl('waiter', [Validators.required,]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
  });

  constructor(public dialogRef: MatDialogRef<AddManagerDialogComponent>, public validator: ValidatorService, public _toastr: ToastrService) { 
    this.validator.setForm(this.managerForm);
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void { 
    if (this.managerForm.invalid) {
      return;
    }
    if (this.managerForm.controls["newPassword"].value !== this.managerForm.controls["repeatPassword"].value) {
      this._toastr.warning('Repeat password not matches with new password!', 'Warning');
      return;
    }
    this.dialogRef.close(this.managerForm);
  }
}
