import { createFeature, createReducer, on } from '@ngrx/store';
import { LocationsActions } from './locations.actions';
import { LocationsState, initialLocationsState } from './locations.state';

export const locationsFeature = createFeature({
  name: 'locations',
  reducer: createReducer(
    initialLocationsState,

    on(
      LocationsActions.loadLocations,
      (state): LocationsState => ({
        ...state,
        loading: true,
        error: null,
      }),
    ),

    on(LocationsActions.loadLocationsSuccess, (state, { locations }): LocationsState => {
      const entities = locations.reduce(
        (acc, location) => {
          acc[location.id] = location;
          return acc;
        },
        {} as LocationsState['entities'],
      );

      const ids = locations.map((d) => d.id);

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
      LocationsActions.loadLocationsFailure,
      (state, { error }): LocationsState => ({
        ...state,
        loading: false,
        error,
      }),
    ),
  ),
});

export const {
  name: locationsFeatureKey,
  reducer: locationsReducer,
  selectLocationsState,
  selectEntities,
  selectIds,
  selectLoading,
  selectLoaded,
  selectError,
} = locationsFeature;
