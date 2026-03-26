import { Component, computed, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectDeviceById } from '../../store/devices/devices.selectors';
import { timer } from 'rxjs';
import { Device } from '../../models/device.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Room } from '../../models/room.model';
import { selectRoomByDeviceId } from '../../store/rooms/rooms.selectors';

interface DeviceVM {
  device: Device | null;
  now: number;
}

@Component({
  selector: 'app-queue',
  imports: [
    DatePipe,
    RouterLink,
    MatToolbarModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './queue.html',
  styleUrl: './queue.scss',
})
export class Queue {
  private readonly minuteTick = toSignal(timer(0, 60_000), { initialValue: 0 });
  readonly $device!: Signal<DeviceVM>;
  readonly $room!: Signal<Room | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {
    this.$device = computed<DeviceVM>(() => {
      const idFromRoute = this.route.snapshot.paramMap.get('id');
      if (!idFromRoute) {
        return { device: null, now: Date.now() };
      }

      // Recompute vm every minute so online/offline status updates without store changes.
      this.minuteTick();

      const device = this.store.selectSignal(selectDeviceById(idFromRoute))();
      return {
        device,
        now: Date.now(),
      };
    });

    this.$room = computed<Room | null>(() => {
      const device = this.$device().device;
      if (!device) {
        return null;
      }

      const room = this.store.selectSignal(selectRoomByDeviceId(device.deviceId))();
      return room ?? null;
    });
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
