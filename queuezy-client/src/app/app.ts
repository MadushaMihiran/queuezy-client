import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { DevicesActions } from './store/devices/devices.actions';
import { LocationsActions } from './store/locations/locations.actions';
import { RoomsActions } from './store/rooms/rooms.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(LocationsActions.loadLocations());
    this.store.dispatch(DevicesActions.loadDevices());
    this.store.dispatch(RoomsActions.loadRooms());
  }

  protected readonly title = signal('queuezy-client');
}
