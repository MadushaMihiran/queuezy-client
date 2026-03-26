export interface Location {
  id: number;
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
}

export type LocationWithRooms = Location & {
  roomCount: number;
  deviceId?: string;
};
