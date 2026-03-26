import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Room } from '../models/room.model';
import { environment } from '../../environments/environment';

interface ApiRoom {
  id: number;
  owner: string;
  number: number;
  building?: string | null;
  floor?: string | null;
  location_id: number;
  device_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class Rooms {
  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http
      .get<ApiRoom[]>(`${environment.apiBaseUrl}/rooms`)
      .pipe(map((rooms) => rooms.map((room) => this.mapApiRoom(room))));
  }

  private mapApiRoom(room: ApiRoom): Room {
    return {
      id: room.id,
      owner: room.owner,
      number: room.number,
      building: room.building ?? null,
      floor: room.floor ?? null,
      locationId: room.location_id,
      deviceId: room.device_id,
    };
  }
}
