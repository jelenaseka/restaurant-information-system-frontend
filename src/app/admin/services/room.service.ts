import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomWithTables } from '../model/room-with-tables.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  public getActiveRooms() : Observable<RoomWithTables[]> {
    return this.http.get<RoomWithTables[]>("/room/active");
  }

}
