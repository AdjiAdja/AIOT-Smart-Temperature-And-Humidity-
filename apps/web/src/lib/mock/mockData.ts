import { RackMeta, SensorReading, DeviceState } from '@/lib/store/useDeviceStore';

export const MOCK_RACKS: RackMeta[] = [
  { id: 'rack-01', name: 'Rack A1', position: [-3, 0, 0], size: [1, 2.2, 1], deviceId: 'esp32s3-01' },
  { id: 'rack-02', name: 'Rack A2', position: [-1.5, 0, 0], size: [1, 2.2, 1], deviceId: 'esp32c3-01' },
  { id: 'rack-03', name: 'Rack B1', position: [1.5, 0, 0], size: [1, 2.2, 1], deviceId: 'stm32f4-01' },
  { id: 'rack-04', name: 'Rack B2', position: [3, 0, 0], size: [1, 2.2, 1], deviceId: 'esp32s3-02' },
];

function randomState(t: number, h: number): DeviceState {
  if (t > 40 && h > 80) return 'CRITICAL';
  if (t > 35) return 'HIGH_TEMP';
  if (h > 80) return 'HIGH_HUMIDITY';
  return 'NORMAL';
}

export function generateMockReading(deviceId: string): SensorReading {
  const base = 24 + Math.random() * 4;
  const spike = Math.random() < 0.1 ? Math.random() * 10 : 0;
  const t = +(base + spike).toFixed(2);
  const h = +(50 + Math.random() * 30).toFixed(2);
  return {
    deviceId,
    temperature: t,
    humidity: h,
    state: randomState(t, h),
    timestamp: Date.now(),
  };
}
