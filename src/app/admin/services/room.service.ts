import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomCreate } from '../model/room-create.model';
import { RoomLayout } from '../model/room-layout.model';
import { RoomWithTables } from '../model/room-with-tables.model';
import { Table } from '../model/table.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  public save(tables: Table[], id : number)  : Observable<void>  {
    return this.http.put<void>("/room/"+id, {tables:tables});
  }

  public getActiveRooms() : Observable<RoomWithTables[]> {
    return this.http.get<RoomWithTables[]>("/room/");
  }

  public editRoomLayout(id: number, dto : RoomLayout) : Observable<void> {
    return this.http.put<void>("/room/"+id+"/layout", dto);
  }

  public addRoom(room : RoomCreate) : Observable<string> {
    return this.http.post<string>("/room", room);
  }

  public updateRoomName(id : number, newName : string) : Observable<void> {
    return this.http.put<void>("/room/"+id+"/name", newName);
  }
  
  public removeRoom(id : number) : Observable<void> {
    return this.http.delete<void>("/room/"+id);
  }

}
