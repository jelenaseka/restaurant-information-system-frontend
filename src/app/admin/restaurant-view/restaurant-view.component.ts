import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ValidatorService } from 'src/app/services/validator.service';
import { RoomCreate } from '../model/room-create.model';
import { RoomLayout } from '../model/room-layout.model';
import { RoomWithTables } from '../model/room-with-tables.model';
import { Table } from '../model/table.model';
import { RoomnameDialogComponent } from '../roomname-dialog/roomname-dialog/roomname-dialog.component';
import { RoomService } from '../services/room.service';

enum Operations {
  REFRESH,
  ADD,
  UPDATE_LAYOUT,
  RENAME,
  DELETE,
}
@Component({
  selector: 'app-restaurant-view',
  templateUrl: './restaurant-view.component.html',
  styleUrls: ['./restaurant-view.component.scss']
})
export class RestaurantViewComponent implements OnInit {

  rooms : RoomWithTables[] = [];

  selected = new FormControl(0);

  newName : string | undefined;

  editMode : boolean = false;

  detailsForm: FormGroup = new FormGroup({
    row: new FormControl({value:'', disabled: true}, [Validators.required, Validators.min(1), Validators.max(10)]),
    column: new FormControl({value:'', disabled: true}, [Validators.required, Validators.min(1), Validators.max(10)])
  });

  constructor(private roomService : RoomService, private dialog: MatDialog, private toastService: ToastrService,
     public validator: ValidatorService) {
      this.validator.setForm(this.detailsForm);
      }

  ngOnInit(): void {
    this.getRooms(Operations.REFRESH);
  }

  selectedChanged(newIndex) : void{
    this.editMode = false;
    this.selected.setValue(newIndex)
    this.setInputValues()
  }

  getRooms(operation : Operations) : void {
    this.roomService.getActiveRooms().subscribe(data => {
      this.rooms = data;
      if(operation === Operations.ADD)
        this.selected.setValue(this.rooms.length - 1);
      else if(operation === Operations.DELETE)
        this.selected.setValue(0);
      
      this.setInputValues();
  })
  }

  getTables() : Table[] {
    let currentRoom : RoomWithTables = this.rooms[this.selected.value];
    return currentRoom.tables;
  };

  setInputValues() : void {
    let rowControl = this.detailsForm.get('row') as FormControl;
    rowControl.setValue(this.getRows())
    let columnControl = this.detailsForm.get('column') as FormControl;
    columnControl.setValue(this.getColumns())
  }

  openDialog(adding : boolean): void {
    this.newName = undefined;
    const dialogRef = this.dialog.open(RoomnameDialogComponent, {
      width: '250px',
      data: {newName: this.newName},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.newName = result;
      if(this.newNameIsValid()) {
        if(adding)
          this.addRoom();
        else
          this.renameRoom();
      }  
    });
  }

  newNameIsValid() : boolean {
    return this.newName !== undefined && this.newName !== "";
  }

  checkDifference() : boolean {
    return this.detailsForm.get('row')?.value === this.rooms[this.selected.value].rows
     && this.detailsForm.get('column')?.value === this.rooms[this.selected.value].columns;
  }

  save() : void {
    // TODO uradi save
    this.turnOffEditMode();
  }

  applyLayoutChanges() : void {
    let selectedId = this.rooms[this.selected.value].id;
    let requestObject = new RoomLayout(this.detailsForm.get('row')?.value as number, this.detailsForm.get('column')?.value as number);
    this.roomService.editRoomLayout(selectedId, requestObject).subscribe(() => {
      this.toastService.success("Room layout changed successfully.", 'Ok');
      this.getRooms(Operations.UPDATE_LAYOUT);
    }, error => this.toastService.error(convertResponseError(error), 'Error'));
  }

  cancel() : void {
    this.turnOffEditMode()
    this.setInputValues();
  }
  
  addRoom() : void {
    let room  = new RoomCreate(this.newName as string);
    this.roomService.addRoom(room).subscribe(() => {
      this.getRooms(Operations.ADD);
    }, error => this.toastService.error(convertResponseError(error), 'Error'));
  }

  renameRoom() : void {
    let selectedId = this.rooms[this.selected.value].id;
    this.roomService.updateRoomName(selectedId, this.newName as string).subscribe(() => {
      this.getRooms(Operations.RENAME);
    }, error => this.toastService.error(convertResponseError(error), 'Error'));
  }

  removeRoom() : void {
    let selectedId = this.rooms[this.selected.value].id;
    this.roomService.removeRoom(selectedId).subscribe(() => {
      this.getRooms(Operations.DELETE);
    }, error => this.toastService.error(convertResponseError(error), 'Error'));
  }

  turnOffEditMode() : void {
    this.editMode = false;

    let control = this.detailsForm.get('row') as FormControl;
    control.disable();
    let control2 = this.detailsForm.get('column') as FormControl;
    control2.disable();
  }

  turnOnEditMode() : void {
    this.editMode = true;

    let control = this.detailsForm.get('row') as FormControl;
    control.enable();
    let control2 = this.detailsForm.get('column') as FormControl;
    control2.enable();
  }

  getRows() : number {
    if(this.rooms.length != 0)
      return this.rooms[this.selected.value].rows;
    return 0;
  }

  getColumns() : number {
    if(this.rooms.length != 0)
      return this.rooms[this.selected.value].columns;
    return 0;
  }

}
