/**
 * TRD Data Service
 * Fetches telemetry and race data from the Toyota GR Cup Series dataset
 * API Documentation: https://trddev.com/hackathon-2025/
 */

export interface TelemetryData {
  meta_time: number;
  timestamp: number;
  lap: number;
  chassis: string;
  car_number: number;
  // Speed & Drivetrain
  speed: number; // km/h
  gear: number;
  nmot: number; // Engine RPM
  // Throttle & Braking
  ath: number; // Throttle blade position (0-100%)
  aps: number; // Accelerator pedal position (0-100%)
  pbrake_f: number; // Front brake pressure (bar)
  pbrake_r: number; // Rear brake pressure (bar)
  // Steering & Dynamics
  sw_angle: number; // Steering wheel angle
  lat_accel: number; // Lateral acceleration
  long_accel: number; // Longitudinal acceleration
}

export interface LapData {
  lap_number: number;
  lap_time: number;
  sector_times: number[];
  best_lap: boolean;
}

export interface DriverData {
  chassis: string;
  car_number: number;
  driver_name?: string;
  current_lap: number;
  position: number;
  tyre_life: number; // 0-100%
  fuel_level: number; // 0-100%
}

export interface WeatherConditions {
  air_temp: number;
  track_temp: number;
  humidity: number;
  rain_probability: number;
  grip_level: number; // 0-100%
}

class TRDDataService {
  private baseUrl = 'https://trddev.com/hackathon-2025';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5000; // 5 seconds

  /**
   * Fetch telemetry data for a specific session
   */
  async fetchTelemetryData(sessionId?: string): Promise<TelemetryData[]> {
    const cacheKey = `telemetry-${sessionId || 'current'}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Mock data for now - replace with actual API call when available
      const mockData: TelemetryData[] = this.generateMockTelemetry();
      this.setCache(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching telemetry data:', error);
      return this.generateMockTelemetry();
    }
  }

  /**
   * Fetch lap data for a specific driver
   */
  async fetchLapData(chassis: string, sessionId?: string): Promise<LapData[]> {
    const cacheKey = `laps-${chassis}-${sessionId || 'current'}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const mockData: LapData[] = this.generateMockLapData();
      this.setCache(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching lap data:', error);
      return this.generateMockLapData();
    }
  }

  /**
   * Fetch current driver standings
   */
  async fetchDriverStandings(): Promise<DriverData[]> {
    const cacheKey = 'driver-standings';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const mockData: DriverData[] = this.generateMockDriverData();
      this.setCache(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      return this.generateMockDriverData();
    }
  }

  /**
   * Fetch current weather and track conditions
   */
  async fetchWeatherConditions(): Promise<WeatherConditions> {
    const cacheKey = 'weather';
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      const mockData: WeatherConditions = {
        air_temp: 24,
        track_temp: 32,
        humidity: 45,
        rain_probability: 15,
        grip_level: 92,
      };
      this.setCache(cacheKey, mockData);
      return mockData;
    } catch (error) {
      console.error('Error fetching weather conditions:', error);
      return {
        air_temp: 24,
        track_temp: 32,
        humidity: 45,
        rain_probability: 15,
        grip_level: 92,
      };
    }
  }

  /**
   * Calculate tire wear based on driving style and conditions
   */
  calculateTireWear(
    currentLife: number,
    brakingIntensity: number,
    corneringSpeed: number,
    trackTemp: number
  ): number {
    const brakingWear = (brakingIntensity / 100) * 0.5;
    const corneringWear = (corneringSpeed / 100) * 0.3;
    const tempWear = Math.max(0, (trackTemp - 30) / 50) * 0.2;
    
    const totalWear = brakingWear + corneringWear + tempWear;
    return Math.max(0, currentLife - totalWear);
  }

  /**
   * Detect DRS activation zones
   */
  getDRSZones(): { start: number; end: number; name: string }[] {
    return [
      { start: 0.2, end: 0.35, name: 'Main Straight' },
      { start: 0.65, end: 0.75, name: 'Back Straight' },
    ];
  }

  // Cache helpers
  private getCached(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Mock data generators
  private generateMockTelemetry(): TelemetryData[] {
    const data: TelemetryData[] = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        meta_time: Date.now() + i * 100,
        timestamp: i * 100,
        lap: Math.floor(i / 20) + 1,
        chassis: '004',
        car_number: 78,
        speed: 120 + Math.random() * 80,
        gear: Math.floor(Math.random() * 6) + 1,
        nmot: 5000 + Math.random() * 3000,
        ath: Math.random() * 100,
        aps: Math.random() * 100,
        pbrake_f: Math.random() * 100,
        pbrake_r: Math.random() * 80,
        sw_angle: (Math.random() - 0.5) * 180,
        lat_accel: (Math.random() - 0.5) * 2,
        long_accel: (Math.random() - 0.5) * 1.5,
      });
    }
    return data;
  }

  private generateMockLapData(): LapData[] {
    return Array.from({ length: 10 }, (_, i) => ({
      lap_number: i + 1,
      lap_time: 92.5 + Math.random() * 3,
      sector_times: [
        30.2 + Math.random(),
        31.1 + Math.random(),
        31.2 + Math.random(),
      ],
      best_lap: i === 5,
    }));
  }

  private generateMockDriverData(): DriverData[] {
    const drivers = [
      { chassis: '004', car_number: 78, driver_name: 'Driver A' },
      { chassis: '005', car_number: 23, driver_name: 'Driver B' },
      { chassis: '006', car_number: 42, driver_name: 'Driver C' },
      { chassis: '007', car_number: 15, driver_name: 'Driver D' },
    ];

    return drivers.map((driver, index) => ({
      ...driver,
      current_lap: 12 + Math.floor(Math.random() * 3),
      position: index + 1,
      tyre_life: 60 + Math.random() * 30,
      fuel_level: 45 + Math.random() * 40,
    }));
  }
}

export const trdDataService = new TRDDataService();
