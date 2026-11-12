import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const STORAGE_KEY = 'aiot_onboarded';

export function useOnboarding() {
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;

    // Tunggu DOM render selesai
    const timer = setTimeout(() => {
      const tour = driver({
        showProgress: true,
        nextBtnText: 'Lanjut',
        prevBtnText: 'Kembali',
        doneBtnText: 'Selesai',
        steps: [
          {
            element: '[data-tour="overview"]',
            popover: {
              title: 'Selamat datang di AIoT DC 👋',
              description: 'Saya akan memandu Anda 1 menit untuk mengenal dashboard ini.',
            },
          },
          {
            element: '[data-tour="kpi-temp"]',
            popover: {
              title: 'KPI Suhu',
              description: 'Rata-rata suhu semua rack, diperbarui real-time tiap 3 detik.',
            },
          },
          {
            element: '[data-tour="rack-list"]',
            popover: {
              title: 'Status Rack',
              description: 'Hijau = normal, kuning = warning, merah = kritis. Klik rack di 3D Twin untuk detail.',
            },
          },
          {
            element: '[data-tour="chart"]',
            popover: {
              title: 'Grafik Live',
              description: 'Tren suhu setiap rack. Untuk analitik historis, lihat menu Analytics (fase 2).',
            },
          },
          {
            element: '[data-tour="alerts"]',
            popover: {
              title: 'Alert Center',
              description: 'Semua anomali muncul di sini. Anda bisa acknowledge dari menu Alerts.',
            },
          },
          {
            element: '[data-tour="twin"]',
            popover: {
              title: '3D Digital Twin',
              description: 'Visualisasi 3D rack data center. Warna berubah sesuai suhu live.',
            },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem(STORAGE_KEY, 'true');
        },
      });
      tour.drive();
    }, 800);

    return () => clearTimeout(timer);
  }, []);
}
