import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { Event } from '../models/event.model';
import { environment } from '../../environments/environment';

interface ApiEvent {
  device_id: string;
  value: number;
  action: string;
  created_at: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class Events {
  constructor(private http: HttpClient) {}

  getDeviceEvents(deviceId: string): Observable<Event[]> {
    return this.http
      .get<ApiEvent[]>(`${environment.apiBaseUrl}/devices/${deviceId}/events`)
      .pipe(map((devices) => devices.map((device) => this.mapApiEvent(device))));
  }

  private mapApiEvent(device: ApiEvent): Event {
    return {
      deviceId: device.device_id,
      value: device.value,
      action: device.action,
      createdAt: device.created_at,
    };
  }
}
