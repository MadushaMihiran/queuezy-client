import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Devices } from '../../services/devices';
import { DevicesActions } from './devices.actions';
import { catchError, map, merge, mergeMap, Observable, of, tap } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class DevicesEffects {
  readonly loadDevices$!: Observable<Action>;
  readonly socketUpdates$!: Observable<Action>;

  constructor(
    private actions$: Actions,
    private devicesService: Devices,
  ) {
    this.loadDevices$ = createEffect(() =>
      this.actions$.pipe(
        ofType(DevicesActions.loadDevices),
        mergeMap(() =>
          this.devicesService.getDevices().pipe(
            map((devices) => DevicesActions.loadDevicesSuccess({ devices })),
            catchError((error) =>
              of(
                DevicesActions.loadDevicesFailure({
                  error: error?.message ?? 'Failed to load devices',
                }),
              ),
            ),
          ),
        ),
      ),
    );

    this.socketUpdates$ = createEffect(() =>
      merge(
        this.devicesService.counterUpdates$().pipe(
          tap((event) => console.log('effect counter event', event)),
          map((event) =>
            DevicesActions.counterUpdateReceived({
              deviceId: event.deviceId,
              value: event.value,
              action: event.action,
              createdAt: event.createdAt,
            }),
          ),
        ),
        this.devicesService.heartbeatUpdates$().pipe(
          tap((event) => console.log('effect heartbeat event', event)),
          map((event) =>
            DevicesActions.heartbeatUpdateReceived({
              deviceId: event.deviceId,
              ip: event.ip ?? null,
              rssi: event.rssi ?? null,
              createdAt: event.createdAt,
            }),
          ),
        ),
      ),
    );
  }
}
