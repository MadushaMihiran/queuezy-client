import { createSelector } from '@ngrx/store';
import {
  selectEntities,
  selectIds,
  selectLoading,
  selectLoaded,
  selectError,
} from './locations.reducer';
import { selectRoomsList } from '../rooms/rooms.selectors';
import { LocationWithRooms } from '../../models/location.model';

export const selectLocationsList = createSelector(selectEntities, selectIds, (entities, ids) =>
  ids.map((id) => entities[id]).filter(Boolean),
);

export const selectLocationById = (id: string) =>
  createSelector(selectEntities, (entities) => entities[id] ?? null);

export const selectLocationsWithRoomCount = createSelector(
  selectLocationsList,
  selectRoomsList,
  (locations, rooms): LocationWithRooms[] =>
    locations.map((location) => {
      const locationRooms = rooms.filter((room) => room.locationId === location.id);
      const entry: LocationWithRooms = { ...location, roomCount: locationRooms.length };
      if (locationRooms.length === 1) {
        entry.deviceId = locationRooms[0].deviceId;
      }
      return entry;
    }),
);

export const selectLocationsVM = createSelector(
  selectLocationsWithRoomCount,
  selectLoading,
  selectLoaded,
  selectError,
  (locations, loading, loaded, error) => ({
    locations,
    loading,
    loaded,
    error,
  }),
);
