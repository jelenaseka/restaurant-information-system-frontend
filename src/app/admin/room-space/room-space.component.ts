import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditRoomDialogComponent } from '../edit-room-dialog/edit-room-dialog.component';
import { Table } from '../model/table.model';
@Component({
  selector: 'app-room-space',
  templateUrl: './room-space.component.html',
  styleUrls: ['./room-space.component.scss']
})
export class RoomSpaceComponent implements OnInit {

  @Input()
  tables :  Table[] = [];
  @Input()
  row :  number = -1;
  @Input()
  column :  number = -1;

  table : Table | undefined;

  constructor( private dialog: MatDialog) { }

  ngOnInit(): void {
    this.tables.forEach(table => {
      if(table.row === this.row && table.column === this.column) {
        this.table = table;
      }
    });
  }

  
  openDialog(): void {
    const dialogRef = this.dialog.open(EditRoomDialogComponent, {
      width: '300px',
      data: {newName: this.table?.name, newShape:this.table?.shape},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined) {
        this.editTable(result);
      }
    });
  }

  editTable(result) : void {
    if(this.table) {
      (this.table as Table).name = result.newName;
      (this.table as Table).shape = result.newShape;
      if(result.newShape === "EMPTY") 
        this.table = undefined;
    } else {
      this.table = new Table(0, result.newName, "FREE", result.newShape, this.row, this.column);
    }
  }

}
