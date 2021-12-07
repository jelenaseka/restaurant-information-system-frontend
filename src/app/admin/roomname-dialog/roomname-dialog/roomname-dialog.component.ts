import { Component, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface NameDialogData {
  newName: string;
}

@Component({
  selector: 'app-roomname-dialog',
  templateUrl: './roomname-dialog.component.html',
  styleUrls: ['./roomname-dialog.component.scss']
})
export class RoomnameDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RoomnameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NameDialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkNewName() {
    if(this.data.newName === "" || this.data.newName === undefined)
      return false;
    return true;
  }

}
