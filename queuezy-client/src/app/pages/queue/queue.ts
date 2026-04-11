import { Component, computed, effect, Signal } from '@angular/core';
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
import { EventsActions } from '../../store/events/events.actions';
import { selectEventsVM } from '../../store/events/events.selectors';

interface DeviceVM {
  device: Device | null;
  now: number;
}

type QueueNumberAction = 'done' | 'up' | 'down' | 'reset' | 'none';

interface QueueNumberVM {
  number: number;
  done: boolean;
  action: QueueNumberAction;
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
  private lastEventsFetchKey: string | null = null;
  readonly $device!: Signal<DeviceVM>;
  readonly $room!: Signal<Room | null>;
  readonly $eventsVM!: Signal<ReturnType<typeof selectEventsVM>>;
  readonly $queueNumbers!: Signal<QueueNumberVM[]>;
  readonly $doneCount!: Signal<number>;
  readonly $notDoneCount!: Signal<number>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {
    this.$eventsVM = this.store.selectSignal(selectEventsVM);

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

    this.$queueNumbers = computed<QueueNumberVM[]>(() => {
      const device = this.$device().device;
      const eventsVM = this.$eventsVM();

      const latestActionByNumber = new Map<number, QueueNumberAction>();

      // Backend returns newest first. The first action seen for a number is its latest state.
      if (device && eventsVM.deviceId === device.deviceId) {
        for (const event of eventsVM.events) {
          if (event.value < 1 || event.value > 99) {
            continue;
          }

          if (latestActionByNumber.has(event.value)) {
            continue;
          }

          const action = (event.action ?? '').toLowerCase();
          if (action === 'done' || action === 'up' || action === 'down' || action === 'reset') {
            latestActionByNumber.set(event.value, action);
            continue;
          }

          latestActionByNumber.set(event.value, 'none');
        }
      }

      return Array.from({ length: 99 }, (_value, index) => {
        const number = index + 1;
        const action = latestActionByNumber.get(number) ?? 'none';
        return {
          number,
          action,
          done: action === 'done',
        };
      });
    });

    this.$doneCount = computed<number>(() =>
      this.$queueNumbers().reduce((count, number) => count + (number.done ? 1 : 0), 0),
    );

    this.$notDoneCount = computed<number>(() => 99 - this.$doneCount());

    effect(() => {
      const device = this.$device().device;
      if (!device) {
        return;
      }

      const fetchKey = `${device.deviceId}:${device.lastCounter ?? 'null'}:${device.lastCounterAction ?? 'null'}`;
      if (this.lastEventsFetchKey === fetchKey) {
        return;
      }

      this.lastEventsFetchKey = fetchKey;
      this.store.dispatch(EventsActions.loadDeviceEvents({ deviceId: device.deviceId }));
    });
  }

  trackByQueueNumber(_index: number, item: QueueNumberVM): number {
    return item.number;
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
