import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
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

  constructor(private roomService : RoomService, private dialog: MatDialog, private toastService: ToastrService) { }

  ngOnInit(): void {
    this.getRooms(false);
  }

  getRooms(lastIsSelected : boolean) : void {
    this.roomService.getActiveRooms().subscribe(data => {
      this.rooms = data;
      if(lastIsSelected)
        this.selected.setValue(this.rooms.length - 1);
  })
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

}
