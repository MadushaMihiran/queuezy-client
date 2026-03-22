import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Locations } from '../../services/locations';
import { LocationsActions } from './locations.actions';
import { catchError, map, merge, mergeMap, Observable, of, tap } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class LocationsEffects {
  readonly loadLocations$!: Observable<Action>;

  constructor(
    private actions$: Actions,
    private locationsService: Locations,
  ) {
    this.loadLocations$ = createEffect(() =>
      this.actions$.pipe(
        ofType(LocationsActions.loadLocations),
        mergeMap(() =>
          this.locationsService.getLocations().pipe(
            map((locations) => LocationsActions.loadLocationsSuccess({ locations })),
            catchError((error) =>
              of(
                LocationsActions.loadLocationsFailure({
                  error: error?.message ?? 'Failed to load locations',
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
