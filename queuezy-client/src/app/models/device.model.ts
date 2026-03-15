export interface Device {
  deviceId: string;
  name: string;
  lastCounter: number | null;
  lastCounterAction: string | null;
  lastSeenAt: string | null;
  lastHeartbeatAt: string | null;
  lastIp: string | null;
  lastRssi: number | null;
}
