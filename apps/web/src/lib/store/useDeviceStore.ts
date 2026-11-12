import { create } from 'zustand';

export type DeviceState = 'NORMAL' | 'HIGH_TEMP' | 'HIGH_HUMIDITY' | 'CRITICAL' | 'SENSOR_FAULT';

export interface SensorReading {
  deviceId: string;
  temperature: number;
  humidity: number;
  state: DeviceState;
  timestamp: number;
}

export interface RackMeta {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  deviceId: string;
}

export interface Alert {
  id: string;
  deviceId: string;
  severity: 'warning' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

interface DeviceStore {
  readings: Record<string, SensorReading>;
  racks: RackMeta[];
  alerts: Alert[];
  updateReading: (r: SensorReading) => void;
  setRacks: (r: RackMeta[]) => void;
  addAlert: (a: Alert) => void;
  acknowledgeAlert: (id: string) => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  readings: {},
  racks: [],
  alerts: [],
  updateReading: (r) =>
    set((s) => ({ readings: { ...s.readings, [r.deviceId]: r } })),
  setRacks: (racks) => set({ racks }),
  addAlert: (a) => set((s) => ({ alerts: [a, ...s.alerts].slice(0, 50) })),
  acknowledgeAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    })),
}));
