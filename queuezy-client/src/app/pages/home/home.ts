import { Component, computed, OnInit, Signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DevicesActions } from '../../store/devices/devices.actions';
import { Store } from '@ngrx/store';
import { selectDevicesVM } from '../../store/devices/devices.selectors';
import { timer } from 'rxjs';
import { Device } from '../../models/device.model';
import { toSignal } from '@angular/core/rxjs-interop';

interface DeviceVM {
  devices: Device[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  now: number;
}

@Component({
  selector: 'app-home',
  imports: [
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
  private readonly minuteTick = toSignal(timer(0, 60_000), { initialValue: 0 });
  readonly $devices!: Signal<DeviceVM>;

  constructor(private store: Store) {
    const devicesVM = this.store.selectSignal(selectDevicesVM);

    this.$devices = computed<DeviceVM>(() => {
      // Recompute vm every minute so online/offline status updates without store changes.
      this.minuteTick();

      return {
        ...devicesVM(),
        now: Date.now(),
      };
    });
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
