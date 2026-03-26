import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

import { devicesReducer } from '../store/devices/devices.reducer';
import { locationsReducer } from '../store/locations/locations.reducer';
import { DevicesState } from '../store/devices/devices.state';
import { LocationsState } from '../store/locations/locations.state';
import { roomsReducer } from '../store/rooms/rooms.reducer';
import { RoomsState } from '../store/rooms/rooms.state';

export interface State {
  devices: DevicesState;
  locations: LocationsState;
  rooms: RoomsState;
}

export const reducers: ActionReducerMap<State> = {
  devices: devicesReducer,
  locations: locationsReducer,
  rooms: roomsReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
