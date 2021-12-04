import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { RoomWithTables } from '../model/room-with-tables.model';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-restaurant-view',
  templateUrl: './restaurant-view.component.html',
  styleUrls: ['./restaurant-view.component.scss']
})
export class RestaurantViewComponent implements OnInit {

  rooms : RoomWithTables[] = [];

  selected = new FormControl(0);

  constructor(private roomService : RoomService) { }

  ngOnInit(): void {
    this.roomService.getActiveRooms().subscribe(data => {
        this.rooms = data;
    })
  }
  
  addRoom() {
    let room  = new RoomWithTables(0, "New", []);
    this.rooms.push(room);
  }

  renameRoom(newName : string) {
    this.rooms[this.selected.value].name = newName;
  }

  removeRoom() {
    this.rooms.splice(this.selected.value, 1);
  }

}
