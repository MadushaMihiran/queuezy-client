import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Events } from '../../services/events';
import { EventsActions } from './events.actions';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class EventsEffects {
  readonly loadDeviceEvents$!: Observable<Action>;

  constructor(
    private actions$: Actions,
    private eventsService: Events,
  ) {
    this.loadDeviceEvents$ = createEffect(() =>
      this.actions$.pipe(
        ofType(EventsActions.loadDeviceEvents),
        mergeMap(({ deviceId }) =>
          this.eventsService.getDeviceEvents(deviceId).pipe(
            map((events) => EventsActions.loadDeviceEventsSuccess({ deviceId, events })),
            catchError((error) =>
              of(
                EventsActions.loadDeviceEventsFailure({
                  error: error?.message ?? 'Failed to load events',
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
