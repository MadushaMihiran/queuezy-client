import { createSelector } from '@ngrx/store';
import {
  selectEntities,
  selectIds,
  selectLoading,
  selectLoaded,
  selectError,
} from './devices.reducer';

export const selectDevicesList = createSelector(selectEntities, selectIds, (entities, ids) =>
  ids.map((id) => entities[id]).filter(Boolean),
);

export const selectDeviceById = (deviceId: string) =>
  createSelector(selectEntities, (entities) => entities[deviceId] ?? null);

export const selectDevicesVM = createSelector(
  selectDevicesList,
  selectLoading,
  selectLoaded,
  selectError,
  (devices, loading, loaded, error) => ({
    devices,
    loading,
    loaded,
    error,
  }),
);
