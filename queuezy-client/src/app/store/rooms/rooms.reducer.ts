import { createFeature, createReducer, on } from '@ngrx/store';
import { RoomsActions } from './rooms.actions';
import { RoomsState, initialRoomsState } from './rooms.state';

export const roomsFeature = createFeature({
  name: 'rooms',
  reducer: createReducer(
    initialRoomsState,

    on(
      RoomsActions.loadRooms,
      (state): RoomsState => ({
        ...state,
        loading: true,
        error: null,
      }),
    ),

    on(RoomsActions.loadRoomsSuccess, (state, { rooms }): RoomsState => {
      const entities = rooms.reduce(
        (acc, room) => {
          acc[room.id] = room;
          return acc;
        },
        {} as RoomsState['entities'],
      );

      const ids = rooms.map((d) => d.id);

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
      RoomsActions.loadRoomsFailure,
      (state, { error }): RoomsState => ({
        ...state,
        loading: false,
        error,
      }),
    ),
  ),
});

export const {
  name: roomsFeatureKey,
  reducer: roomsReducer,
  selectRoomsState,
  selectEntities,
  selectIds,
  selectLoading,
  selectLoaded,
  selectError,
} = roomsFeature;
