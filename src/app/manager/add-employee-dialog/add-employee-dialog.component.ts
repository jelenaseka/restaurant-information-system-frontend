import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UnregistaredUserDetails } from '../employees/models/unregistered-user-details';

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.scss']
})
export class AddEmployeeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddEmployeeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: UnregistaredUserDetails) { 
  }

  ngOnInit(): void {
    this.data.firstName = "Jovan";
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void { 
    this.data.firstName = "Pera";
    this.dialogRef.close(this.data);
  }
}
