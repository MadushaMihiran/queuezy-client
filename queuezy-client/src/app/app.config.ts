import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { provideEffects } from '@ngrx/effects';
import { DevicesEffects } from './store/devices/devices.effects';
import { LocationsEffects } from './store/locations/locations.effects';
import { RoomsEffects } from './store/rooms/rooms.effects';
import { EventsEffects } from './store/events/events.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideStore(reducers, { metaReducers }),
    provideEffects([DevicesEffects, LocationsEffects, RoomsEffects, EventsEffects]),
    provideStoreDevtools({ maxAge: 25 }),
  ],
};
