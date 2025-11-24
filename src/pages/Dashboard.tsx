import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { TrackConditions } from "@/components/TrackConditions";
import dashboardBg from "@/assets/dashboard-bg.jpg";
import { 
  Gauge, 
  TrendingUp, 
  Activity, 
  Users, 
  LogOut,
  Zap,
  BarChart3,
  Radio,
  Moon,
  Sun,
  Mic,
  MicOff,
  Sparkles
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDark, toggleDarkMode } = useDarkMode();
  const { isListening, toggleListening } = useVoiceCommands();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profileData);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isEngineer = profile?.role === "engineer";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary via-warning to-secondary flex items-center justify-center">
              <Gauge className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Morizo Pro
              </h1>
              <p className="text-xs text-muted-foreground">Toyota GR Cup Analytics</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleListening}
              className={isListening ? "bg-primary/20 text-primary" : ""}
            >
              {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                {isEngineer ? (
                  <>
                    <Gauge className="h-3 w-3 text-secondary" />
                    Engineer
                  </>
                ) : (
                  <>
                    <Zap className="h-3 w-3 text-accent" />
                    Fan
                  </>
                )}
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div 
        className="relative h-64 overflow-hidden border-b border-border/50"
        style={{
          backgroundImage: `url(${dashboardBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/30" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-warning to-secondary bg-clip-text text-transparent">
            Welcome to Your Command Center
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Real-time telemetry analysis, race predictions, and comprehensive insights for the Toyota GR Cup Series.
            {isEngineer 
              ? " Access advanced engineering tools and detailed performance metrics."
              : " Explore race data, predictions, and engage with the racing community."}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Track Conditions - Full width on small screens, 1 col on large */}
          <div className="lg:col-span-1">
            <TrackConditions />
          </div>

          {/* Media Lab Card */}
          <Card 
            className="lg:col-span-2 bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20 border-accent/30 hover:border-accent/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-accent/20"
            onClick={() => navigate('/media-lab')}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <CardTitle>Media Lab</CardTitle>
              </div>
              <CardDescription>
                AI-powered image and video generation powered by Lovable AI. Create stunning racing visuals instantly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="racing" className="w-full">
                Open Media Lab
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Driver Training & Insights */}
          <Card className="bg-card/50 backdrop-blur border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Driver Training</CardTitle>
              </div>
              <CardDescription>
                Optimize braking zones, throttle inputs, and racing lines with detailed telemetry analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => navigate('/driver-training')}>
                View Insights
              </Button>
            </CardContent>
          </Card>

          {/* Pre-Event Prediction */}
          <Card className="bg-card/50 backdrop-blur border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-lg hover:shadow-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <CardTitle>Race Predictions</CardTitle>
              </div>
              <CardDescription>
                ML-powered qualifying and race result forecasts based on practice data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => navigate('/race-predictions')}>
                View Predictions
              </Button>
            </CardContent>
          </Card>

          {/* Post-Event Analysis */}
          <Card className="bg-card/50 backdrop-blur border-accent/20 hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-accent" />
                <CardTitle>Post-Race Analysis</CardTitle>
              </div>
              <CardDescription>
                Interactive dashboards with lap-by-lap breakdowns and strategy insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => navigate('/post-race-analysis')}>
                Analyze Races
              </Button>
            </CardContent>
          </Card>

          {/* Real-Time Analytics */}
          <Card className="bg-card/50 backdrop-blur border-warning/20 hover:border-warning/50 transition-all hover:shadow-lg hover:shadow-warning/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Radio className="h-5 w-5 text-warning" />
                <CardTitle>Live Telemetry</CardTitle>
              </div>
              <CardDescription>
                Real-time pit stop timing, tire health monitoring, and strategy recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => navigate('/live-telemetry')}>
                Go Live
              </Button>
            </CardContent>
          </Card>

          {/* Fan Engagement */}
          {!isEngineer && (
            <Card className="bg-card/50 backdrop-blur border-yellow/20 hover:border-yellow/50 transition-all hover:shadow-lg hover:shadow-yellow/20">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-yellow" />
                  <CardTitle>Fan Zone</CardTitle>
                </div>
                <CardDescription>
                  AR overlays, AI commentary, and gamified predictions for an immersive experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline" onClick={() => navigate('/fan-zone')}>
                  Explore
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Data Source Info */}
          <Card className="bg-card/50 backdrop-blur border-muted/20 hover:border-muted/50 transition-all">
            <CardHeader>
              <CardTitle className="text-sm">Data Source</CardTitle>
              <CardDescription className="text-xs">
                All analytics powered by Toyota GR Cup Series telemetry data from the 2025 TRD Hackathon dataset.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">Available Parameters:</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Speed</span>
                <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">Throttle</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Brake</span>
                <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">Steering</span>
                <span className="text-xs bg-yellow/10 text-yellow px-2 py-1 rounded">RPM</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Banner */}
        <Card className="mt-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-accent animate-pulse" />
              <span className="font-medium">System Status:</span>
              <span className="text-accent">All Systems Operational</span>
              <span className="mx-2">•</span>
              <span className="text-muted-foreground">Real-time data streaming active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
