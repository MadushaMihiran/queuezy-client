import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import { Device } from '../models/device.model';
import { environment } from '../../environments/environment';

export interface CounterUpdateEvent {
  deviceId: string;
  value: number;
  action: string;
  createdAt: string;
}

export interface HeartbeatUpdateEvent {
  deviceId: string;
  ip: string | null;
  rssi: number | null;
  createdAt: string;
}

interface ApiDevice {
  device_id: string;
  name?: string;
  last_counter?: number | null;
  last_counter_action?: string | null;
  last_seen_at?: string | null;
  last_heartbeat_at?: string | null;
  last_ip?: string | null;
  last_rssi?: number | null;
}

interface ApiCounterUpdateEvent {
  device_id: string;
  value: number;
  action: string;
  created_at: string;
}

interface ApiHeartbeatUpdateEvent {
  device_id: string;
  ip: string | null;
  rssi: number | null;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
    });
  }

  getDevices(): Observable<Device[]> {
    return this.http
      .get<ApiDevice[]>(`${environment.apiBaseUrl}/devices`)
      .pipe(map((devices) => devices.map((device) => this.mapApiDevice(device))));
  }

  counterUpdates$(): Observable<CounterUpdateEvent> {
    return new Observable<CounterUpdateEvent>((observer) => {
      this.socket.on('counter:update', (data: CounterUpdateEvent | ApiCounterUpdateEvent) => {
        observer.next(this.mapCounterUpdate(data));
      });

      return () => {
        this.socket.off('counter:update');
      };
    });
  }

  heartbeatUpdates$(): Observable<HeartbeatUpdateEvent> {
    return new Observable<HeartbeatUpdateEvent>((observer) => {
      this.socket.on('heartbeat:update', (data: HeartbeatUpdateEvent | ApiHeartbeatUpdateEvent) => {
        observer.next(this.mapHeartbeatUpdate(data));
      });

      return () => {
        this.socket.off('heartbeat:update');
      };
    });
  }

  private mapApiDevice(device: ApiDevice): Device {
    return {
      deviceId: device.device_id,
      name: device.name ?? device.device_id,
      lastCounter: device.last_counter ?? null,
      lastCounterAction: device.last_counter_action ?? null,
      lastSeenAt: device.last_seen_at ?? null,
      lastHeartbeatAt: device.last_heartbeat_at ?? null,
      lastIp: device.last_ip ?? null,
      lastRssi: device.last_rssi ?? null,
    };
  }

  private mapCounterUpdate(data: CounterUpdateEvent | ApiCounterUpdateEvent): CounterUpdateEvent {
    if ('deviceId' in data) {
      return data;
    }

    return {
      deviceId: data.device_id,
      value: data.value,
      action: data.action,
      createdAt: data.created_at,
    };
  }

  private mapHeartbeatUpdate(
    data: HeartbeatUpdateEvent | ApiHeartbeatUpdateEvent,
  ): HeartbeatUpdateEvent {
    if ('deviceId' in data) {
      return data;
    }

    return {
      deviceId: data.device_id,
      ip: data.ip,
      rssi: data.rssi,
      createdAt: data.created_at,
    };
  }
}
