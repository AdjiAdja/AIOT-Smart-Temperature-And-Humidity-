# Firmware MCU — AIoT DC

Tiga target:
- **ESP32-S3**: `pio run -e esp32-s3-devkitc-1 -t upload`
- **ESP32-C3 Supermini**: `pio run -e esp32-c3-devkitm-1 -t upload`
- **STM32F4**: Buka `stm32/README_cubemx.md`, generate dari CubeMX, flash via STM32CubeIDE.

**Koneksi sensor**: DHT22 → VCC 3.3V, GND, DATA ke GPIO (lihat `main.cpp` per board). Pull-up 10kΩ wajib.

**Topik MQTT**: Sinkron dengan `packages/shared/src/index.ts`.
