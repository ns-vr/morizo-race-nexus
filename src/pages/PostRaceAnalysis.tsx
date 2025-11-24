import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Flag, Clock, Zap } from "lucide-react";
import { trdDataService } from "@/services/trdDataService";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const PostRaceAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [raceResults, setRaceResults] = useState<any[]>([]);
  const [lapData, setLapData] = useState<any[]>([]);

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        const drivers = await trdDataService.fetchDriverStandings();
        const allLaps: any[] = [];
        
        for (const driver of drivers) {
          const laps = await trdDataService.fetchLapData(driver.chassis);
          laps.forEach((lap: any) => {
            allLaps.push({ ...lap, driverId: driver.chassis, speed: 150 + Math.random() * 30 });
          });
        }
        
        const results = drivers.map((driver: any) => {
          const driverLaps = allLaps.filter((lap: any) => lap.driverId === driver.chassis);
          const totalTime = driverLaps.reduce((sum: number, lap: any) => sum + lap.lap_time, 0);
          const bestLap = Math.min(...driverLaps.map((lap: any) => lap.lap_time));
          const avgLap = totalTime / driverLaps.length;
          
          return {
            id: driver.chassis,
            name: driver.driver_name || `Driver ${driver.car_number}`,
            team: `Team ${driver.car_number}`,
            totalTime: totalTime.toFixed(2),
            bestLap: bestLap.toFixed(2),
            avgLap: avgLap.toFixed(2),
            lapsCompleted: driverLaps.length,
          };
        }).sort((a: any, b: any) => parseFloat(a.totalTime) - parseFloat(b.totalTime));

        setRaceResults(results);
        setLapData(allLaps);
      } catch (error) {
        console.error("Error loading race analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysis();
  }, []);

  if (loading) return <LoadingSpinner />;

  const winner = raceResults[0];
  const fastestLap = lapData.length > 0 ? lapData.reduce((fastest, lap) => 
    lap.lap_time < fastest.lap_time ? lap : fastest
  , lapData[0]) : { lap_time: 0, lapNumber: 0 };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent via-warning to-secondary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Post-Race Analysis</h1>
              <p className="text-xs text-muted-foreground">Complete Race Breakdown</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-yellow/20 to-warning/20 border-yellow/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Flag className="h-5 w-5 text-yellow" />
                Race Winner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{winner?.name}</p>
              <p className="text-sm text-muted-foreground">Team {winner?.team}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-5 w-5 text-primary" />
                Fastest Lap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{fastestLap?.lap_time.toFixed(2)}s</p>
              <p className="text-sm text-muted-foreground">Lap {fastestLap?.lap_number || 'N/A'}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-secondary/20 border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-5 w-5 text-accent" />
                Total Laps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Math.max(...lapData.map(l => l.lap_number || 0))}</p>
              <p className="text-sm text-muted-foreground">Race Distance</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Final Race Results</CardTitle>
            <CardDescription>Complete classification and timing breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {raceResults.map((driver: any, index: number) => (
                <div 
                  key={driver.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index === 0 ? 'bg-yellow/10 border-yellow/30' :
                    index === 1 ? 'bg-muted/10 border-muted/30' :
                    index === 2 ? 'bg-warning/10 border-warning/30' :
                    'bg-card/50 border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold w-12 ${
                      index === 0 ? 'text-yellow' :
                      index === 1 ? 'text-muted' :
                      index === 2 ? 'text-warning' :
                      'text-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">{driver.name}</h3>
                      <p className="text-sm text-muted-foreground">Team {driver.team}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Time</p>
                      <p className="font-mono font-bold">{driver.totalTime}s</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Best Lap</p>
                      <p className="font-mono font-bold">{driver.bestLap}s</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Avg Lap</p>
                      <p className="font-mono font-bold">{driver.avgLap}s</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Race Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-accent mt-2" />
              <p className="text-sm">Lap 5: Lead change as {raceResults[1]?.name} overtakes at Turn 3</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-warning mt-2" />
              <p className="text-sm">Lap 12: {winner?.name} sets fastest lap of the race</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <p className="text-sm">Lap 18: Close battle between top 3 positions through final sector</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-secondary mt-2" />
              <p className="text-sm">Lap 24: {winner?.name} extends lead with consistent 1:32 lap times</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostRaceAnalysis;
