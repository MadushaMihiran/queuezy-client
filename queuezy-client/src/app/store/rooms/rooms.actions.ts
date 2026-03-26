import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Room } from '../../models/room.model';

export const RoomsActions = createActionGroup({
  source: 'Rooms',
  events: {
    'Load Rooms': emptyProps(),
    'Load Rooms Success': props<{ rooms: Room[] }>(),
    'Load Rooms Failure': props<{ error: string }>(),
  },
});
