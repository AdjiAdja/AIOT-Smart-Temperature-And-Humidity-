import { useEffect } from 'react';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { generateMockReading, MOCK_RACKS } from './mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Hook utama: subscribe ke sumber data.
 * - Jika VITE_USE_MOCK=true → simulasi data tiap 3 detik.
 * - Jika false → hubungkan ke MQTT via WSS (diimplementasikan di phase 2).
 */
export function useLiveData() {
  const { updateReading, addAlert, setRacks } = useDeviceStore();

  useEffect(() => {
    setRacks(MOCK_RACKS);
  }, [setRacks]);

  useEffect(() => {
    if (!USE_MOCK) {
      // TODO: real MQTT client (phase 2)
      console.info('[LiveData] Real MQTT mode - not yet wired');
      return;
    }

    console.info('[LiveData] Mock mode active');
    const tick = () => {
      MOCK_RACKS.forEach((r) => {
        const reading = generateMockReading(r.deviceId);
        updateReading(reading);
        if (reading.state === 'CRITICAL' && Math.random() < 0.3) {
          addAlert({
            id: crypto.randomUUID(),
            deviceId: r.deviceId,
            severity: 'critical',
            message: `Suhu kritis: ${reading.temperature}°C di ${r.name}`,
            timestamp: Date.now(),
            acknowledged: false,
          });
        }
      });
    };

    tick();
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, [updateReading, addAlert]);
}
