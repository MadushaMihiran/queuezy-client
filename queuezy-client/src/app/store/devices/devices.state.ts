import { Device } from '../../models/device.model';

export interface DevicesState {
  entities: Record<string, Device>;
  ids: string[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialDevicesState: DevicesState = {
  entities: {},
  ids: [],
  loading: false,
  loaded: false,
  error: null,
};
