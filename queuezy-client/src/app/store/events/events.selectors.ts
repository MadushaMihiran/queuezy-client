import { createSelector } from '@ngrx/store';
import {
  selectDeviceId,
  selectEvents,
  selectLoading,
  selectLoaded,
  selectError,
} from './events.reducer';

export const selectEventsVM = createSelector(
  selectDeviceId,
  selectEvents,
  selectLoading,
  selectLoaded,
  selectError,
  (deviceId, events, loading, loaded, error) => ({
    deviceId,
    events,
    loading,
    loaded,
    error,
  }),
);
