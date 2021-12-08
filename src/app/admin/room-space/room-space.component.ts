import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EditRoomDialogComponent } from '../edit-room-dialog/edit-room-dialog.component';
import { Table } from '../model/table.model';
@Component({
  selector: 'app-room-space',
  templateUrl: './room-space.component.html',
  styleUrls: ['./room-space.component.scss']
})
export class RoomSpaceComponent implements OnInit, OnChanges {

  @Input()
  isInWaiter :  boolean = false;
  @Input()
  editMode :  boolean = false;
  @Input()
  tables :  Table[] = [];
  @Input()
  row :  number = -1;
  @Input()
  column :  number = -1;

  table : Table | undefined;

  constructor(private dialog: MatDialog, private router: Router) { }

  ngOnChanges() : void {
    this.table = undefined;
    this.tables.forEach(table => {
      if(table.row === this.row && table.column === this.column) {
        this.table = table;
      }
    });
  }

  ngOnInit(): void {
    this.tables.forEach(table => {
      if(table.row === this.row && table.column === this.column) {
        this.table = table;
      }
    });
  }
  
  openDialog(): void {
    if(this.isInWaiter) {
      this.router.navigate(['/home/waiter',this.table?.id]);
    } else {
      if(this.editMode) {
        const dialogRef = this.dialog.open(EditRoomDialogComponent, {
          width: '300px',
          data: {newName: this.table?.name, newShape:this.table?.shape, alreadyUsedNames:this.tables?.map(t=>t.name)},
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if(result !== undefined) {
            this.editTable(result);
          }
        });
      }
    }
  }

  editTable(result) : void {
    if(this.table) {
      if(result.newShape === "EMPTY") {
        // REMOVE EXISTING
        const index = this.tables.indexOf(this.table);
        this.tables.splice(index, 1)
        this.table = undefined;
      } else {
        // UPDATE EXISTING
        const index = this.tables.indexOf(this.table);
        this.tables[index].name = result.newName;
        this.tables[index].shape = result.newShape;
        this.table = this.tables[index];
      }
    } else {
      // ADD NEW
      this.table = new Table(0, result.newName, "FREE", result.newShape, this.row, this.column);
      this.tables.push(this.table)
    }
  }

}
