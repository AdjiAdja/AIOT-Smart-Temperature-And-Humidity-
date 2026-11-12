# AIOT-Smart-Temperature-And-Humidity-

Dashboard monitoring suhu/kelembaban berbasis MQTT, dengan **3D Digital Twin**, **onboarding guide**, dan dukungan **ESP32-S3 / ESP32-C3 / STM32** + sensor **DHT22**.

![Tech](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![3D](https://img.shields.io/badge/Three.js-r168-black?logo=three.js) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)

## 📦 Struktur

- `apps/web` — Frontend React + Vite (deploy ke Vercel/CF Pages)
- `apps/api` — Backend NestJS (fase 2, deploy terpisah)
- `packages/shared` — Tipe TypeScript bersama
- `firmware/` — Kode ESP32-S3, ESP32-C3, STM32
- `infra/` — docker-compose Mosquitto, InfluxDB, Postgres, Redis, MinIO

## 🏃 Jalankan Lokal

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
# edit .env.local, set VITE_USE_MOCK=true untuk demo
pnpm dev:web
