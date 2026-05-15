# Smart Irrigation System

A premium, modern single-page application (SPA) for smart irrigation advice and monitoring. 
Features a live dashboard, weather integration, and a sophisticated watering advice algorithm.

## Features
- **Modern UI**: Dark/green nature-themed design with glassmorphism and smooth animations.
- **Live Dashboard**: Real-time sensor gauges for soil moisture, temperature, and humidity.
- **Smart Advice**: Multi-factor algorithm considering crop type, growth stage, soil type, and current moisture levels.
- **Weather Panel**: Real-time simulated weather forecast.
- **Single Page Application**: Registration and all features integrated into one seamless interface.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (with hot-reload):
   ```bash
   npm run dev
   ```

3. Or start the production server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Important Note Regarding Data Storage

> [!WARNING]
> **In-Memory Data**: All data (irrigation history, registered users) is currently stored **in-memory**. 
> This means that **every time the server restarts, all data will be reset**. 

This application is designed as a frontend showcase and prototype. To persist data permanently, you can swap the in-memory arrays in `server.js` with a real database (e.g., MongoDB, PostgreSQL, or SQLite).

Similarly, the weather and dashboard sensor data are currently simulated. They can be replaced with real API calls (e.g., OpenWeatherMap) and real IoT sensor data in the future.
