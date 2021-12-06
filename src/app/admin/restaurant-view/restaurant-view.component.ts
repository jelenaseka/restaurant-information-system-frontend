import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ValidatorService } from 'src/app/services/validator.service';
import { RoomCreate } from '../model/room-create.model';
import { RoomWithTables } from '../model/room-with-tables.model';
import { RoomnameDialogComponent } from '../roomname-dialog/roomname-dialog/roomname-dialog.component';
import { RoomService } from '../services/room.service';

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
    row: new FormControl({value:'', disabled: !this.editMode}, [Validators.required,]),
    column: new FormControl({value:'', disabled: !this.editMode}, [Validators.required,])
  });

  constructor(private roomService : RoomService, private dialog: MatDialog, private toastService: ToastrService,
     public validator: ValidatorService) {
      this.validator.setForm(this.detailsForm);
      }

  ngOnInit(): void {
    this.getRooms(false);
  }

  selectedChanged(newIndex) {
    this.selected.setValue(newIndex)
    this.setInputValues()
  }

  getRooms(lastIsSelected : boolean) : void {
    this.roomService.getActiveRooms().subscribe(data => {
      this.rooms = data;
      if(lastIsSelected)
        this.selected.setValue(this.rooms.length - 1);
      else
        this.selected.setValue(0);
      
      this.setInputValues()
  })
  }

  setInputValues() {
    this.editMode = false;
    let rowControl = this.detailsForm.get('row') as FormControl;
    rowControl.setValue(this.getRows()+"")
    let columnControl = this.detailsForm.get('column') as FormControl;
    columnControl.setValue(this.getColumns()+"")
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

  
  addRoom() : void {
    let room  = new RoomCreate(this.newName as string);

    this.roomService.addRoom(room).subscribe(() => {
      this.getRooms(true);
    }, error => this.toastService.error(convertResponseError(error), 'Error'));

  }

  renameRoom() : void {
    let selectedId = this.rooms[this.selected.value].id;
    this.roomService.updateRoomName(selectedId, this.newName as string).subscribe(() => {
      this.getRooms(false);
    }, error => this.toastService.error(convertResponseError(error), 'Error'));
  }

  removeRoom() : void {
    let selectedId = this.rooms[this.selected.value].id;
    this.roomService.removeRoom(selectedId).subscribe(() => {
      this.getRooms(false);
    }, error => this.toastService.error(convertResponseError(error), 'Error'));
  }

  toogleEditMode() {
    this.editMode = !this.editMode;

    let control = this.detailsForm.get('row') as FormControl;
    control.disabled ? control.enable() : control.disable();
    let control2 = this.detailsForm.get('column') as FormControl;
    control2.disabled ? control2.enable() : control2.disable();
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
