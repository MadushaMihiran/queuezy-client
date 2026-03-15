import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Device } from '../../models/device.model';

export const DevicesActions = createActionGroup({
  source: 'Devices',
  events: {
    'Load Devices': emptyProps(),
    'Load Devices Success': props<{ devices: Device[] }>(),
    'Load Devices Failure': props<{ error: string }>(),

    'Socket Connected': emptyProps(),
    'Socket Disconnected': emptyProps(),

    'Counter Update Received': props<{
      deviceId: string;
      value: number;
      action: string;
      createdAt: string;
    }>(),

    'Heartbeat Update Received': props<{
      deviceId: string;
      ip: string | null;
      rssi: number | null;
      createdAt: string;
    }>(),
  },
});
