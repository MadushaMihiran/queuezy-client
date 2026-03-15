import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf, DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DevicesActions } from '../../store/devices/devices.actions';
import { Store } from '@ngrx/store';
import { selectDevicesVm } from '../../store/devices/devices.selectors';
import { combineLatest, map, Observable, timer } from 'rxjs';
import { Device } from '../../models/device.model';

interface HomeVm {
  devices: Device[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  now: number;
}

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    NgIf,
    DatePipe,
    MatToolbarModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  vm$!: Observable<HomeVm>;

  constructor(private store: Store) {
    this.vm$ = combineLatest([this.store.select(selectDevicesVm), timer(0, 60_000)]).pipe(
      map(([vm]) => ({
        ...vm,
        now: Date.now(),
      })),
    );
  }

  ngOnInit(): void {
    this.store.dispatch(DevicesActions.loadDevices());
  }

  trackByDeviceId(_index: number, device: Device): string {
    return device.deviceId;
  }

  isOnline(device: Device, now: number): boolean {
    if (!device?.lastHeartbeatAt) {
      return false;
    }

    const heartbeatTime = new Date(device.lastHeartbeatAt).getTime();
    const diffMs = now - heartbeatTime;

    return diffMs < 10 * 60 * 1000;
  }
}
