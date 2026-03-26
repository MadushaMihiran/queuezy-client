import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Rooms } from '../../services/rooms';
import { RoomsActions } from './rooms.actions';
import { catchError, map, mergeMap, Observable, of, tap } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class RoomsEffects {
  readonly loadRooms$!: Observable<Action>;

  constructor(
    private actions$: Actions,
    private roomsService: Rooms,
  ) {
    this.loadRooms$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RoomsActions.loadRooms),
        mergeMap(() =>
          this.roomsService.getRooms().pipe(
            map((rooms) => RoomsActions.loadRoomsSuccess({ rooms })),
            catchError((error) =>
              of(
                RoomsActions.loadRoomsFailure({
                  error: error?.message ?? 'Failed to load rooms',
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
