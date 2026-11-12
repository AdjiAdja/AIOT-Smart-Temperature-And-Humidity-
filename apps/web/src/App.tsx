import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Overview from '@/routes/Overview';
import Twin from '@/routes/Twin';
import Devices from '@/routes/Devices';
import Alerts from '@/routes/Alerts';
import { useLiveData } from '@/lib/mock/useLiveData';

export default function App() {
  // Subscribe ke data live (mock atau MQTT nyata)
  useLiveData();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="twin" element={<Twin />} />
        <Route path="devices" element={<Devices />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
}
