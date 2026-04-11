import { Event } from '../../models/event.model';

export interface EventsState {
  deviceId: string | null;
  events: Event[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialEventsState: EventsState = {
  deviceId: null,
  events: [],
  loading: false,
  loaded: false,
  error: null,
};
