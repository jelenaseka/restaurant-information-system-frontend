import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RoomWithTables } from 'src/app/admin/model/room-with-tables.model';
import { RoomService } from 'src/app/admin/services/room.service';
import { SocketResponse } from 'src/app/sockets/model/socket-response.model';
import { SocketService } from 'src/app/sockets/socket.service';

@Component({
  selector: 'app-waiter-homepage',
  templateUrl: './waiter-homepage.component.html',
  styleUrls: ['./waiter-homepage.component.scss']
})
export class WaiterHomepageComponent implements OnInit {
  pinCode: string | undefined;
  table: string = 'T1';

  rooms : RoomWithTables[] = [];

  selected = new FormControl(0);

  constructor(private roomService : RoomService,  private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.connect("order", this.handleChange);
    this.getRooms();
  }

  handleChange = (data : SocketResponse) => {
    if(data.successfullyFinished) {
      this.getRooms();
    }
  }

  getRooms() : void {
    this.roomService.getActiveRooms().subscribe(data => {
      this.rooms = data;  
  })
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
