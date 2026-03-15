import { createFeature, createReducer, on } from '@ngrx/store';
import { DevicesActions } from './devices.actions';
import { DevicesState, initialDevicesState } from './devices.state';

export const devicesFeature = createFeature({
  name: 'devices',
  reducer: createReducer(
    initialDevicesState,

    on(
      DevicesActions.loadDevices,
      (state): DevicesState => ({
        ...state,
        loading: true,
        error: null,
      }),
    ),

    on(DevicesActions.loadDevicesSuccess, (state, { devices }): DevicesState => {
      const entities = devices.reduce(
        (acc, device) => {
          acc[device.deviceId] = device;
          return acc;
        },
        {} as DevicesState['entities'],
      );

      const ids = devices.map((d) => d.deviceId);

      return {
        ...state,
        entities,
        ids,
        loading: false,
        loaded: true,
        error: null,
      };
    }),

    on(
      DevicesActions.loadDevicesFailure,
      (state, { error }): DevicesState => ({
        ...state,
        loading: false,
        error,
      }),
    ),

    on(
      DevicesActions.counterUpdateReceived,
      (state, { deviceId, value, action, createdAt }): DevicesState => {
        const current = state.entities[deviceId];

        if (!current) {
          return state;
        }

        return {
          ...state,
          entities: {
            ...state.entities,
            [deviceId]: {
              ...current,
              lastCounter: value,
              lastCounterAction: action,
              lastSeenAt: createdAt,
            },
          },
        };
      },
    ),

    on(
      DevicesActions.heartbeatUpdateReceived,
      (state, { deviceId, ip, rssi, createdAt }): DevicesState => {
        const current = state.entities[deviceId];

        if (!current) {
          return state;
        }

        return {
          ...state,
          entities: {
            ...state.entities,
            [deviceId]: {
              ...current,
              lastIp: ip,
              lastRssi: rssi,
              lastHeartbeatAt: createdAt,
            },
          },
        };
      },
    ),
  ),
});

export const {
  name: devicesFeatureKey,
  reducer: devicesReducer,
  selectDevicesState,
  selectEntities,
  selectIds,
  selectLoading,
  selectLoaded,
  selectError,
} = devicesFeature;
