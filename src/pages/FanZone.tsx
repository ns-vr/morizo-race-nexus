import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Trophy, Star, MessageSquare, ThumbsUp } from "lucide-react";
import { trdDataService } from "@/services/trdDataService";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const FanZone = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const driversData = await trdDataService.fetchDriverStandings();
        const driversWithFanData = driversData.map((driver: any) => ({
          id: driver.chassis,
          name: driver.driver_name || `Driver ${driver.car_number}`,
          team: `Team ${driver.car_number}`,
          carNumber: driver.car_number,
          fans: Math.floor(Math.random() * 50000) + 10000,
          likes: Math.floor(Math.random() * 100000) + 20000,
          rating: (Math.random() * 2 + 3).toFixed(1),
        }));
        setDrivers(driversWithFanData);
        setSelectedDriver(driversWithFanData[0]);
      } catch (error) {
        console.error("Error loading fan zone data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow via-warning to-accent flex items-center justify-center">
              <Users className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Fan Zone</h1>
              <p className="text-xs text-muted-foreground">Community & Engagement</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gradient-to-br from-yellow/20 via-warning/20 to-accent/20 border-yellow/30">
            <CardHeader>
              <CardTitle>Fan Favorites</CardTitle>
              <CardDescription>Most popular drivers this season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {drivers.slice(0, 5).map((driver: any, index: number) => (
                  <div 
                    key={driver.id}
                    className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/50 hover:border-accent/50 transition-all cursor-pointer"
                    onClick={() => setSelectedDriver(driver)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold w-10 ${
                        index === 0 ? 'text-yellow' : 'text-muted-foreground'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">Team {driver.team}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-bold">{(driver.fans / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-accent" />
                        <span className="font-bold">{(driver.likes / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow fill-yellow" />
                        <span className="font-bold">{driver.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">Total Fans</span>
                </div>
                <span className="text-xl font-bold">245k</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  <span className="font-medium">Comments</span>
                </div>
                <span className="text-xl font-bold">12.5k</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-warning" />
                  <span className="font-medium">Predictions</span>
                </div>
                <span className="text-xl font-bold">8.2k</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedDriver && (
          <Card className="mt-6 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Driver Profile: {selectedDriver.name}</CardTitle>
              <CardDescription>Team {selectedDriver.team} • Car #{selectedDriver.carNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{(selectedDriver.fans / 1000).toFixed(1)}k</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <ThumbsUp className="h-8 w-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold">{(selectedDriver.likes / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-muted-foreground">Likes</p>
                </div>
                
                <div className="text-center p-4 bg-yellow/10 rounded-lg">
                  <Star className="h-8 w-8 text-yellow fill-yellow mx-auto mb-2" />
                  <p className="text-2xl font-bold">{selectedDriver.rating}</p>
                  <p className="text-sm text-muted-foreground">Fan Rating</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Recent Fan Activity</h3>
                
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">@racing_fan_2024</p>
                        <p className="text-sm text-muted-foreground">Amazing performance in qualifying! Can't wait to see the race 🏁</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-accent mt-1" />
                      <div>
                        <p className="font-medium">@speed_demon_gr</p>
                        <p className="text-sm text-muted-foreground">That overtake in Turn 3 was legendary! 🔥 #MorizoPro</p>
                        <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-secondary mt-1" />
                      <div>
                        <p className="font-medium">@toyota_enthusiast</p>
                        <p className="text-sm text-muted-foreground">Consistent lap times all session. This is championship material! 🏆</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FanZone;
