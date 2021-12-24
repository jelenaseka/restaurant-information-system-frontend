import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {
  hideOld: boolean = true;
  hideNew: boolean = true;
  hideRepeat: boolean = true;

  passwordForm: FormGroup = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
  });

  constructor(public dialogRef: MatDialogRef<ChangePasswordDialogComponent>, public validator: ValidatorService, public _toastr: ToastrService) { 
    this.validator.setForm(this.passwordForm);
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void { 
    if (this.passwordForm.invalid) {
      return;
    }
    if (this.passwordForm.controls["newPassword"].value !== this.passwordForm.controls["repeatPassword"].value) {
      this._toastr.warning('Repeat password not matches with new password!', 'Warning');
      return;
    }
    this.dialogRef.close(this.passwordForm);
  }
}
