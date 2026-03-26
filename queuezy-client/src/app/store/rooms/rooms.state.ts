import { Room } from '../../models/room.model';

export interface RoomsState {
  entities: Record<string, Room>;
  ids: number[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialRoomsState: RoomsState = {
  entities: {},
  ids: [],
  loading: false,
  loaded: false,
  error: null,
};
