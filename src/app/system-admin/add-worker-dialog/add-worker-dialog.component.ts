import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ValidatorService } from 'src/app/services/validator.service';

@Component({
  selector: 'app-add-worker-dialog',
  templateUrl: './add-worker-dialog.component.html',
  styleUrls: ['./add-worker-dialog.component.scss']
})
export class AddWorkerDialogComponent implements OnInit {

  detailsForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required,]),
    lastName: new FormControl('', [Validators.required,]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{10}")]),
    salary: new FormControl('', [Validators.required,]),
    type: new FormControl('waiter', [Validators.required,]),
    pinCode: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4),
      Validators.pattern("^[0-9]*$")]),
  });

  constructor(public dialogRef: MatDialogRef<AddWorkerDialogComponent>, public validator: ValidatorService,) { 
    this.validator.setForm(this.detailsForm);
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void { 
    if (this.detailsForm.invalid) {
      return;
    }
    this.dialogRef.close(this.detailsForm);
  }
}
