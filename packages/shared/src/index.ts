export type DeviceState = 'NORMAL' | 'HIGH_TEMP' | 'HIGH_HUMIDITY' | 'CRITICAL' | 'SENSOR_FAULT';

export interface SensorReading {
  deviceId: string;
  temperature: number;
  humidity: number;
  state: DeviceState;
  timestamp: number;
}

// Topik MQTT (sinkron dengan firmware/common/mqtt_topics.h)
export const MQTT_TOPICS = {
  temperature: 'sensors/%s/temperature',
  humidity: 'sensors/%s/humidity',
  state: 'sensors/%s/state',
  alert: 'alerts/%s',
  status: 'devices/%s/status',
  command: 'commands/%s',
} as const;
