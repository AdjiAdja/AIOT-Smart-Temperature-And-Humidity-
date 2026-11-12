import { useDeviceStore } from '@/lib/store/useDeviceStore';

export default function Devices() {
  const racks = useDeviceStore((s) => s.racks);
  const readings = useDeviceStore((s) => s.readings);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Devices</h2>
      <div className="card overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-400 border-b border-border">
            <tr>
              <th className="py-2">Device ID</th>
              <th className="py-2">Rack</th>
              <th className="py-2">Suhu</th>
              <th className="py-2">Humidity</th>
              <th className="py-2">State</th>
              <th className="py-2">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {racks.map((r) => {
              const rd = readings[r.deviceId];
              return (
                <tr key={r.id} className="border-b border-border/50 hover:bg-border/20">
                  <td className="py-2 mono text-accent">{r.deviceId}</td>
                  <td className="py-2">{r.name}</td>
                  <td className="py-2 mono">{rd?.temperature.toFixed(1) ?? '--'}°C</td>
                  <td className="py-2 mono">{rd?.humidity.toFixed(1) ?? '--'}%</td>
                  <td className="py-2">{rd?.state ?? 'N/A'}</td>
                  <td className="py-2 mono text-xs">
                    {rd ? new Date(rd.timestamp).toLocaleTimeString('id-ID') : '--'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
