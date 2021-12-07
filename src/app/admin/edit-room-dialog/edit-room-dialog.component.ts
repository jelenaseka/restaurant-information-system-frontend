import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-room-dialog',
  templateUrl: './edit-room-dialog.component.html',
  styleUrls: ['./edit-room-dialog.component.scss']
})
export class EditRoomDialogComponent {

  selected = 'EMPTY';

  constructor(public dialogRef: MatDialogRef<EditRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { 
      if(data.newShape === "CIRCLE")
        this.selected = "CIRCLE";
      if(data.newShape === "SQUARE")
        this.selected = "SQUARE";
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkNewName() : boolean {
    if(this.data.newName === "" || this.data.newName === undefined)
      return false;
    return true;
  }

  returnObject() {
    return {newName:this.data.newName,newShape:this.selected};
  }
}
