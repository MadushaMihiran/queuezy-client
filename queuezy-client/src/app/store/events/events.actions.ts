import { createActionGroup, props } from '@ngrx/store';
import { Event } from '../../models/event.model';

export const EventsActions = createActionGroup({
  source: 'Events',
  events: {
    'Load Device Events': props<{ deviceId: string }>(),
    'Load Device Events Success': props<{ deviceId: string; events: Event[] }>(),
    'Load Device Events Failure': props<{ error: string }>(),
  },
});
