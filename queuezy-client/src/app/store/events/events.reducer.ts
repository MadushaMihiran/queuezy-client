import { createFeature, createReducer, on } from '@ngrx/store';
import { EventsActions } from './events.actions';
import { EventsState, initialEventsState } from './events.state';

export const eventsFeature = createFeature({
  name: 'events',
  reducer: createReducer(
    initialEventsState,

    on(
      EventsActions.loadDeviceEvents,
      (state, { deviceId }): EventsState => ({
        ...state,
        deviceId,
        loading: true,
        error: null,
      }),
    ),

    on(
      EventsActions.loadDeviceEventsSuccess,
      (state, { deviceId, events }): EventsState => ({
        ...state,
        deviceId,
        events,
        loading: false,
        loaded: true,
        error: null,
      }),
    ),

    on(
      EventsActions.loadDeviceEventsFailure,
      (state, { error }): EventsState => ({
        ...state,
        loading: false,
        error,
      }),
    ),
  ),
});

export const {
  name: eventsFeatureKey,
  reducer: eventsReducer,
  selectEventsState,
  selectDeviceId,
  selectEvents,
  selectLoading,
  selectLoaded,
  selectError,
} = eventsFeature;
