import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

import { devicesReducer } from '../store/devices/devices.reducer';
import { DevicesState } from '../store/devices/devices.state';

export interface State {
  devices: DevicesState;
}

export const reducers: ActionReducerMap<State> = {
  devices: devicesReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
