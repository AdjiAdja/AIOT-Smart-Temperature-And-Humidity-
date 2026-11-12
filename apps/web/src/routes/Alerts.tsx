import { useDeviceStore } from '@/lib/store/useDeviceStore';

export default function Alerts() {
  const alerts = useDeviceStore((s) => s.alerts);
  const ack = useDeviceStore((s) => s.acknowledgeAlert);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Alerts</h2>
      <div className="card space-y-2">
        {alerts.length === 0 && <p className="text-sm text-slate-500">Tidak ada alert.</p>}
        {alerts.map((a) => (
          <div key={a.id} className="flex items-center gap-3 p-3 rounded border border-border/60">
            <span className={`w-2 h-2 rounded-full ${a.severity === 'critical' ? 'bg-danger' : 'bg-warning'}`} />
            <div className="flex-1">
              <p className="text-sm">{a.message}</p>
              <p className="text-xs text-slate-500 mono">{new Date(a.timestamp).toLocaleString('id-ID')}</p>
            </div>
            {!a.acknowledged && (
              <button
                onClick={() => ack(a.id)}
                className="text-xs px-3 py-1.5 rounded bg-accent/20 text-accent hover:bg-accent/30"
              >
                Acknowledge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
