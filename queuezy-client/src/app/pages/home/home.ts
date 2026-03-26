import { Component, computed, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectLocationsVM } from '../../store/locations/locations.selectors';
import { LocationWithRooms } from '../../models/location.model';

interface LocationVM {
  locations: LocationWithRooms[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

@Component({
  selector: 'app-home',
  imports: [MatToolbarModule, MatCardModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly $locations!: Signal<LocationVM>;

  constructor(private store: Store, private router: Router) {
    this.$locations = this.store.selectSignal(selectLocationsVM);
  }

  onCardClick(location: LocationWithRooms): void {
    if (location.roomCount === 1 && location.deviceId) {
      this.router.navigate(['/queue', location.deviceId]);
    }
  }

  trackByDeviceId(_index: number, location: LocationWithRooms): number {
    return location.id;
  }
}
