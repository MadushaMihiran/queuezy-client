export interface Room {
  id: number;
  owner: string | null;
  number: number;
  building: string | null;
  floor: string | null;
  locationId: number;
  deviceId: string;
}
