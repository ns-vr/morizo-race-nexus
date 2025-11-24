import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Radio, Gauge, Thermometer, Droplets, Wind } from "lucide-react";
import { trdDataService } from "@/services/trdDataService";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const LiveTelemetry = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const driversData = await trdDataService.fetchDriverStandings();
        const weatherData = await trdDataService.fetchWeatherConditions();
        
        const driversWithTelemetry = driversData.map((driver: any) => {
          return {
            id: driver.chassis,
            name: driver.driver_name || `Driver ${driver.car_number}`,
            team: `Team ${driver.car_number}`,
            carNumber: driver.car_number,
            currentSpeed: (150 + Math.random() * 50).toFixed(1),
            throttle: Math.floor(Math.random() * 100),
            brake: Math.floor(Math.random() * 50),
            gear: Math.floor(Math.random() * 6) + 1,
            rpm: Math.floor(Math.random() * 3000) + 5000,
            tireTemp: Math.floor(Math.random() * 30) + 80,
            lastLap: (92 + Math.random() * 3).toFixed(2),
          };
        });

        setDrivers(driversWithTelemetry);
        setWeather({
          airTemperature: weatherData.air_temp,
          trackTemperature: weatherData.track_temp,
          humidity: weatherData.humidity,
          windSpeed: 12 + Math.floor(Math.random() * 8),
        });
      } catch (error) {
        console.error("Error loading telemetry:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setDrivers(prev => prev.map(driver => ({
        ...driver,
        currentSpeed: (parseFloat(driver.currentSpeed) + Math.random() * 20 - 10).toFixed(1),
        throttle: Math.max(0, Math.min(100, driver.throttle + Math.floor(Math.random() * 20 - 10))),
        brake: Math.max(0, Math.min(100, driver.brake + Math.floor(Math.random() * 30 - 15))),
        gear: Math.max(1, Math.min(6, driver.gear + (Math.random() > 0.5 ? 1 : -1))),
        rpm: Math.floor(Math.random() * 3000) + 5000,
        tireTemp: Math.max(70, Math.min(110, driver.tireTemp + Math.floor(Math.random() * 4 - 2))),
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-warning via-primary to-accent flex items-center justify-center">
                <Radio className="h-5 w-5 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Live Telemetry</h1>
                <p className="text-xs text-muted-foreground">Real-Time Data Stream</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant={isLive ? "destructive" : "racing"}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? "Stop Live Feed" : "Start Live Feed"}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {weather && (
          <Card className="mb-6 bg-gradient-to-r from-blue/20 via-accent/20 to-primary/20 border-blue/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Track Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-xs text-muted-foreground">Air Temp</p>
                    <p className="font-bold">{weather.airTemperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Track Temp</p>
                    <p className="font-bold">{weather.trackTemperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="font-bold">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Wind Speed</p>
                    <p className="font-bold">{weather.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {drivers.map((driver: any) => (
            <Card key={driver.id} className="bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{driver.name}</CardTitle>
                    <CardDescription>Team {driver.team} - Car #{driver.carNumber}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLive && <div className="h-3 w-3 rounded-full bg-accent animate-pulse" />}
                    <span className="text-xs font-medium">{isLive ? 'LIVE' : 'PAUSED'}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Speed</p>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-4 w-4 text-primary" />
                      <p className="text-xl font-bold font-mono">{driver.currentSpeed}</p>
                      <p className="text-xs text-muted-foreground">km/h</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Throttle</p>
                    <div className="h-8 bg-muted rounded overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${driver.throttle}%` }}
                      />
                    </div>
                    <p className="text-xs font-mono mt-1">{driver.throttle}%</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Brake</p>
                    <div className="h-8 bg-muted rounded overflow-hidden">
                      <div 
                        className="h-full bg-red transition-all duration-300"
                        style={{ width: `${driver.brake}%` }}
                      />
                    </div>
                    <p className="text-xs font-mono mt-1">{driver.brake}%</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Gear</p>
                    <p className="text-2xl font-bold font-mono text-secondary">{driver.gear}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">RPM</p>
                    <p className="text-lg font-bold font-mono">{driver.rpm}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tire Temp</p>
                    <p className={`text-lg font-bold font-mono ${
                      driver.tireTemp > 100 ? 'text-red' : 
                      driver.tireTemp > 90 ? 'text-warning' : 
                      'text-accent'
                    }`}>
                      {driver.tireTemp}°C
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Lap</p>
                    <p className="text-lg font-bold font-mono">{driver.lastLap}s</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTelemetry;
