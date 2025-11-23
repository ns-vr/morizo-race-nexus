import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trdDataService, WeatherConditions } from "@/services/trdDataService";
import { LoadingSpinner } from "./LoadingSpinner";
import { 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from "lucide-react";

export const TrackConditions = () => {
  const [conditions, setConditions] = useState<WeatherConditions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const data = await trdDataService.fetchWeatherConditions();
        setConditions(data);
      } catch (error) {
        console.error("Error fetching conditions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
    const interval = setInterval(fetchConditions, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-warning/20">
        <CardContent className="p-6">
          <LoadingSpinner message="Loading track conditions..." />
        </CardContent>
      </Card>
    );
  }

  if (!conditions) return null;

  const getTireWearImpact = () => {
    if (conditions.track_temp > 35) return { level: "high", icon: TrendingUp, color: "text-primary" };
    if (conditions.track_temp > 25) return { level: "moderate", icon: TrendingDown, color: "text-yellow" };
    return { level: "low", icon: TrendingDown, color: "text-accent" };
  };

  const getGripLevel = () => {
    if (conditions.grip_level > 85) return { status: "optimal", color: "text-accent" };
    if (conditions.grip_level > 70) return { status: "good", color: "text-yellow" };
    return { status: "poor", color: "text-primary" };
  };

  const tireWear = getTireWearImpact();
  const grip = getGripLevel();

  return (
    <Card className="bg-card/50 backdrop-blur border-warning/20">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Cloud className="h-5 w-5 text-warning" />
          <CardTitle>Track Conditions</CardTitle>
        </div>
        <CardDescription>
          Real-time weather and surface data affecting performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Temperature Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Thermometer className="h-4 w-4" />
              <span>Air Temp</span>
            </div>
            <p className="text-2xl font-bold">{conditions.air_temp}°C</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Thermometer className="h-4 w-4 text-warning" />
              <span>Track Temp</span>
            </div>
            <p className="text-2xl font-bold text-warning">{conditions.track_temp}°C</p>
          </div>
        </div>

        {/* Humidity & Rain */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplets className="h-4 w-4" />
              <span>Humidity</span>
            </div>
            <p className="text-xl font-semibold">{conditions.humidity}%</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wind className="h-4 w-4" />
              <span>Rain Chance</span>
            </div>
            <p className="text-xl font-semibold">{conditions.rain_probability}%</p>
          </div>
        </div>

        {/* Performance Impact */}
        <div className="pt-4 border-t border-border/50 space-y-3">
          <h4 className="text-sm font-semibold">Performance Impact</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Grip Level</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${grip.color}`}>
                  {conditions.grip_level}%
                </span>
                <span className={`text-xs ${grip.color} capitalize`}>
                  {grip.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tire Degradation</span>
              <div className="flex items-center gap-2">
                <tireWear.icon className={`h-4 w-4 ${tireWear.color}`} />
                <span className={`text-sm font-semibold ${tireWear.color} capitalize`}>
                  {tireWear.level}
                </span>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {(conditions.track_temp > 35 || conditions.rain_probability > 30) && (
            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
              <div className="text-xs space-y-1">
                {conditions.track_temp > 35 && (
                  <p className="text-warning">
                    High track temperature: Expect increased tire wear
                  </p>
                )}
                {conditions.rain_probability > 30 && (
                  <p className="text-warning">
                    Rain likely: Monitor grip levels and adjust strategy
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
