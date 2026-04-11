import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

import { devicesReducer } from '../store/devices/devices.reducer';
import { locationsReducer } from '../store/locations/locations.reducer';
import { DevicesState } from '../store/devices/devices.state';
import { LocationsState } from '../store/locations/locations.state';
import { roomsReducer } from '../store/rooms/rooms.reducer';
import { RoomsState } from '../store/rooms/rooms.state';
import { eventsReducer } from '../store/events/events.reducer';
import { EventsState } from '../store/events/events.state';

export interface State {
  devices: DevicesState;
  locations: LocationsState;
  rooms: RoomsState;
  events: EventsState;
}

export const reducers: ActionReducerMap<State> = {
  devices: devicesReducer,
  locations: locationsReducer,
  rooms: roomsReducer,
  events: eventsReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
