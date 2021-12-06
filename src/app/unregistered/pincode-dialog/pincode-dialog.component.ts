import { Component, Inject, Input, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  pinCode: string;
  heading: string;
}

@Component({
  selector: 'app-pincode-dialog',
  templateUrl: './pincode-dialog.component.html',
  styleUrls: ['./pincode-dialog.component.scss']
})
export class PincodeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PincodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkPinCode() {
    let data  = Number(this.data.pinCode);
    if(!isNaN(+data))
      return false;
    return true;
  }

}
