import { createSelector } from '@ngrx/store';
import {
  selectEntities,
  selectIds,
  selectLoading,
  selectLoaded,
  selectError,
} from './rooms.reducer';

export const selectRoomsList = createSelector(selectEntities, selectIds, (entities, ids) =>
  ids.map((id) => entities[id]).filter(Boolean),
);

export const selectRoomById = (id: string) =>
  createSelector(selectEntities, (entities) => entities[id] ?? null);

export const selectRoomByDeviceId = (deviceId: string) =>
  createSelector(
    selectRoomsList,
    (rooms) => rooms.find((room) => room.deviceId === deviceId) ?? null,
  );

export const selectRoomsVM = createSelector(
  selectRoomsList,
  selectLoading,
  selectLoaded,
  selectError,
  (rooms, loading, loaded, error) => ({
    rooms,
    loading,
    loaded,
    error,
  }),
);
