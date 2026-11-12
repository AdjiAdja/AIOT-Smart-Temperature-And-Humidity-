import { useDeviceStore } from '@/lib/store/useDeviceStore';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { Thermometer, Droplets, AlertTriangle, Activity } from 'lucide-react';
import { useMemo } from 'react';

function stateColor(state: string) {
  switch (state) {
    case 'CRITICAL': return 'bg-danger/20 text-danger border-danger/40';
    case 'HIGH_TEMP': return 'bg-warning/20 text-warning border-warning/40';
    case 'HIGH_HUMIDITY': return 'bg-warning/20 text-warning border-warning/40';
    case 'SENSOR_FAULT': return 'bg-danger/20 text-danger border-danger/40';
    default: return 'bg-success/20 text-success border-success/40';
  }
}

export default function Overview() {
  const racks = useDeviceStore((s) => s.racks);
  const readings = useDeviceStore((s) => s.readings);
  const alerts = useDeviceStore((s) => s.alerts);

  const latest = Object.values(readings);
  const avgTemp = latest.length
    ? +(latest.reduce((a, r) => a + r.temperature, 0) / latest.length).toFixed(1)
    : 0;
  const avgHum = latest.length
    ? +(latest.reduce((a, r) => a + r.humidity, 0) / latest.length).toFixed(1)
    : 0;
  const criticalCount = latest.filter((r) => r.state === 'CRITICAL').length;

  // Chart data: satu titik per update (max 30 titik)
  const chartData = useMemo(() => {
    return racks.map((r) => {
      const reading = readings[r.deviceId];
      return { name: r.name, temp: reading?.temperature ?? 0, hum: reading?.humidity ?? 0 };
    });
  }, [racks, readings]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Command Center</h2>
        <p className="text-sm text-slate-400 mt-1">Live monitoring seluruh rack data center</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI label="Avg Temperature" value={`${avgTemp}°C`} icon={Thermometer} tone="accent" data-tour="kpi-temp" />
        <KPI label="Avg Humidity" value={`${avgHum}%`} icon={Droplets} tone="accent" />
        <KPI label="Critical Racks" value={criticalCount} icon={AlertTriangle} tone={criticalCount ? 'danger' : 'success'} />
        <KPI label="Active Alerts" value={alerts.filter((a) => !a.acknowledged).length} icon={Activity} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rack status list */}
        <div className="card lg:col-span-1" data-tour="rack-list">
          <h3 className="font-semibold mb-3">Rack Status</h3>
          <div className="space-y-2">
            {racks.map((r) => {
              const reading = readings[r.deviceId];
              return (
                <div
                  key={r.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border ${stateColor(reading?.state ?? 'NORMAL')}`}
                >
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs opacity-70 mono">{r.deviceId}</p>
                  </div>
                  <div className="text-right text-xs mono">
                    <div>{reading?.temperature.toFixed(1) ?? '--'}°C</div>
                    <div>{reading?.humidity.toFixed(1) ?? '--'}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Temperature chart */}
        <div className="card lg:col-span-2" data-tour="chart">
          <h3 className="font-semibold mb-3">Temperatur per Rack (Live)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#263352" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} unit="°C" />
              <Tooltip
                contentStyle={{ background: '#141C2E', border: '1px solid #263352', borderRadius: 8 }}
                labelStyle={{ color: '#F1F5F9' }}
              />
              <Line type="monotone" dataKey="temp" stroke="#22D3EE" strokeWidth={2} dot={{ r: 4 }} name="Suhu (°C)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent alerts */}
      <div className="card" data-tour="alerts">
        <h3 className="font-semibold mb-3">Recent Alerts</h3>
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada alert. Sistem normal.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-auto">
            {alerts.slice(0, 8).map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-sm p-2 rounded hover:bg-border/30">
                <span className={`w-2 h-2 rounded-full ${a.severity === 'critical' ? 'bg-danger' : 'bg-warning'}`} />
                <span className="flex-1">{a.message}</span>
                <span className="text-xs text-slate-500 mono">
                  {new Date(a.timestamp).toLocaleTimeString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KPI({ label, value, icon: Icon, tone, ...rest }: any) {
  const toneClass = {
    accent: 'text-accent',
    danger: 'text-danger',
    success: 'text-success',
    warning: 'text-warning',
  }[tone as string];
  return (
    <div className="card" {...rest}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
        <Icon size={18} className={toneClass} />
      </div>
      <p className={`text-3xl font-semibold mt-2 mono ${toneClass}`}>{value}</p>
    </div>
  );
}
