import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Location } from '../models/location.model';
import { environment } from '../../environments/environment';

interface ApiLocation {
  id: number;
  name: string;
  address_line1?: string | null;
  address_line2?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class Locations {
  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http
      .get<ApiLocation[]>(`${environment.apiBaseUrl}/locations`)
      .pipe(map((locations) => locations.map((location) => this.mapApiLocation(location))));
  }

  private mapApiLocation(location: ApiLocation): Location {
    return {
      id: location.id,
      name: location.name,
      addressLine1: location.address_line1 ?? null,
      addressLine2: location.address_line2 ?? null,
    };
  }
}
