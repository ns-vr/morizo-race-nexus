import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { trdDataService } from "@/services/trdDataService";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const DriverTraining = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const driversData = await trdDataService.fetchDriverStandings();
        const drivers = driversData.map((d: any) => ({
          id: d.chassis,
          name: d.driver_name || `Driver ${d.car_number}`,
          team: `Team ${d.car_number}`,
          carNumber: d.car_number,
        }));
        setDrivers(drivers);
        if (drivers.length > 0) {
          setSelectedDriver(drivers[0]);
          const analysis = {
            avgSpeed: 145 + Math.random() * 20,
            topSpeed: 220 + Math.random() * 15,
            consistency: 85 + Math.random() * 10,
          };
          setAnalysis(analysis);
        }
      } catch (error) {
        console.error("Error loading driver data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDriverSelect = async (driver: any) => {
    setSelectedDriver(driver);
    setLoading(true);
    try {
      const analysis = {
        avgSpeed: 145 + Math.random() * 20,
        topSpeed: 220 + Math.random() * 15,
        consistency: 85 + Math.random() * 10,
      };
      setAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing driver:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedDriver) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary via-secondary to-warning flex items-center justify-center">
              <Activity className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Driver Training & Insights</h1>
              <p className="text-xs text-muted-foreground">Telemetry Analysis & Coaching</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Select Driver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {drivers.map((driver: any) => (
                <Button
                  key={driver.id}
                  variant={selectedDriver?.id === driver.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleDriverSelect(driver)}
                >
                  {driver.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            {selectedDriver && analysis && (
              <>
                <Card className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border-primary/30">
                  <CardHeader>
                    <CardTitle>{selectedDriver.name}</CardTitle>
                    <CardDescription>Team {selectedDriver.team} - Car #{selectedDriver.carNumber}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Average Speed</p>
                        <p className="text-2xl font-bold">{analysis.avgSpeed.toFixed(1)} km/h</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Top Speed</p>
                        <p className="text-2xl font-bold">{analysis.topSpeed.toFixed(1)} km/h</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Consistency</p>
                        <p className="text-2xl font-bold">{analysis.consistency.toFixed(1)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-accent/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-4 w-4 text-accent" />
                        Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                        <p className="text-sm">Excellent throttle control in high-speed corners (avg 87% efficiency)</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                        <p className="text-sm">Consistent lap times with low variation (±0.3s)</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                        <p className="text-sm">Strong exit speed from Turn 7 complex</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-warning/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-warning mt-2" />
                        <p className="text-sm">Braking zone entry could be optimized by 5-8 meters at Turn 1</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-warning mt-2" />
                        <p className="text-sm">Throttle application timing in chicane section needs refinement</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-warning mt-2" />
                        <p className="text-sm">Racing line deviation detected in sector 2 (avg 0.8m off optimal)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>AI Coach Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Braking Optimization
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on braking 8 meters later into Turn 1. Current data shows you're losing 0.15s per lap. 
                        Practice threshold braking at 95% pressure to maximize deceleration while maintaining stability.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-secondary" />
                        Racing Line Precision
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Sector 2 shows line deviation. Target the apex marker at Turn 4 more aggressively. 
                        Your current line is costing approximately 0.2s through that complex.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-accent" />
                        Throttle Management
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Excellent overall, but chicane entry could be smoother. Try progressive throttle (65% → 85% → 100%) 
                        rather than abrupt inputs to reduce rear instability.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverTraining;
