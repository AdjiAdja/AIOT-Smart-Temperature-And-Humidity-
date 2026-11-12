import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text, ContactShadows } from '@react-three/drei';
import { useDeviceStore, RackMeta } from '@/lib/store/useDeviceStore';
import { useState } from 'react';

function colorForState(state?: string) {
  switch (state) {
    case 'CRITICAL': return '#EF4444';
    case 'HIGH_TEMP':
    case 'HIGH_HUMIDITY': return '#F59E0B';
    case 'SENSOR_FAULT': return '#EF4444';
    default: return '#10B981';
  }
}

function Rack({ rack, onClick, selected }: { rack: RackMeta; onClick: () => void; selected: boolean }) {
  const reading = useDeviceStore((s) => s.readings[rack.deviceId]);
  const color = colorForState(reading?.state);
  const [w, h, d] = rack.size;

  return (
    <group position={rack.position} onClick={onClick}>
      <mesh position={[0, h / 2, 0]} castShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 0.5 : 0.15}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Label */}
      <Text
        position={[0, h + 0.3, 0]}
        fontSize={0.18}
        color="#F1F5F9"
        anchorX="center"
        anchorY="middle"
      >
        {rack.name}
      </Text>
      <Text
        position={[0, h + 0.05, 0]}
        fontSize={0.13}
        color="#94A3B8"
        anchorX="center"
      >
        {reading ? `${reading.temperature.toFixed(1)}°C / ${reading.humidity.toFixed(0)}%` : '--'}
      </Text>
    </group>
  );
}

export default function Twin() {
  const racks = useDeviceStore((s) => s.racks);
  const readings = useDeviceStore((s) => s.readings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = racks.find((r) => r.id === selectedId);
  const selectedReading = selected ? readings[selected.deviceId] : null;

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h2 className="text-2xl font-semibold">3D Digital Twin</h2>
        <p className="text-sm text-slate-400 mt-1">
          Klik rack untuk melihat detail. Warna = status suhu live.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
        <div className="card lg:col-span-3 p-0 overflow-hidden" style={{ minHeight: 500 }}>
          <Canvas camera={{ position: [6, 5, 8], fov: 45 }} shadows data-tour="twin-canvas">
            <color attach="background" args={['#0B1220']} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Environment preset="city" />

            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#141C2E" />
            </mesh>

            {racks.map((r) => (
              <Rack
                key={r.id}
                rack={r}
                selected={selectedId === r.id}
                onClick={() => setSelectedId(r.id)}
              />
            ))}

            <ContactShadows position={[0, 0, 0]} opacity={0.4} blur={2} far={5} />
            <OrbitControls enablePan enableZoom enableRotate />
          </Canvas>
        </div>

        {/* Side panel */}
        <div className="card lg:col-span-1" data-tour="twin-panel">
          <h3 className="font-semibold mb-3">Detail Rack</h3>
          {!selected ? (
            <p className="text-sm text-slate-500">Pilih rack pada tampilan 3D.</p>
          ) : (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400">Nama</p>
                <p className="font-medium">{selected.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Device ID</p>
                <p className="mono text-accent">{selected.deviceId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p className="font-medium">{selectedReading?.state ?? 'N/A'}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-border/30 rounded p-2">
                  <p className="text-xs text-slate-400">Suhu</p>
                  <p className="mono text-lg">{selectedReading?.temperature.toFixed(1) ?? '--'}°C</p>
                </div>
                <div className="bg-border/30 rounded p-2">
                  <p className="text-xs text-slate-400">Kelembaban</p>
                  <p className="mono text-lg">{selectedReading?.humidity.toFixed(1) ?? '--'}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
