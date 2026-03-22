import { Location } from '../../models/location.model';

export interface LocationsState {
  entities: Record<string, Location>;
  ids: string[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialLocationsState: LocationsState = {
  entities: {},
  ids: [],
  loading: false,
  loaded: false,
  error: null,
};
