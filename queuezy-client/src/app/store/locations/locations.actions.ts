import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Location } from '../../models/location.model';

export const LocationsActions = createActionGroup({
  source: 'Locations',
  events: {
    'Load Locations': emptyProps(),
    'Load Locations Success': props<{ locations: Location[] }>(),
    'Load Locations Failure': props<{ error: string }>(),
  },
});
