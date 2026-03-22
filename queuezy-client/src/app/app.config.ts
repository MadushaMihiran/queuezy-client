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
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { Locations } from './services/locations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideStore(reducers, { metaReducers }),
    provideEffects([DevicesEffects, LocationsEffects]),
    provideStoreDevtools({ maxAge: 25 }),
  ],
};
