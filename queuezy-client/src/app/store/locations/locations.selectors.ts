import { createSelector } from '@ngrx/store';
import {
  selectEntities,
  selectIds,
  selectLoading,
  selectLoaded,
  selectError,
} from './locations.reducer';

export const selectDevicesList = createSelector(selectEntities, selectIds, (entities, ids) =>
  ids.map((id) => entities[id]).filter(Boolean),
);

export const selectLocationById = (id: string) =>
  createSelector(selectEntities, (entities) => entities[id] ?? null);

export const selectLocationsVM = createSelector(
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
