import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import heroRacingImg from "@/assets/hero-racing.jpg";
import { Gauge, Zap, TrendingUp, Radio, BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  const features = [
    {
      icon: Gauge,
      title: "Driver Training",
      description: "AI-powered virtual coaching with personalized feedback and telemetry insights.",
      color: "text-primary",
      gradient: "from-primary/20 to-primary/5"
    },
    {
      icon: TrendingUp,
      title: "Race Predictions",
      description: "ML models forecast qualifying results, tire degradation, and pit windows.",
      color: "text-secondary",
      gradient: "from-secondary/20 to-secondary/5"
    },
    {
      icon: BarChart3,
      title: "Post-Race Analysis",
      description: "Interactive dashboards with lap-by-lap breakdowns and strategy outcomes.",
      color: "text-accent",
      gradient: "from-accent/20 to-accent/5"
    },
    {
      icon: Radio,
      title: "Real-Time Analytics",
      description: "Live telemetry monitoring with predictive alerts and strategy recommendations.",
      color: "text-warning",
      gradient: "from-warning/20 to-warning/5"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroRacingImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/50" />
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary via-warning to-secondary flex items-center justify-center animate-pulse">
                <Gauge className="h-8 w-8 text-background" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Morizo Pro
              </h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              The Ultimate Racing Analytics Platform
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Comprehensive data-driven insights for drivers, teams, engineers, and fans. 
              Powered by Toyota GR Cup Series telemetry data from the 2025 TRD Hackathon.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg"
                variant="racing"
                onClick={() => navigate("/auth")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg"
                onClick={() => navigate("/auth")}
              >
                <Zap className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>Real-time Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                <span>ML Predictions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Live Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Powerful Features</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for complete race analysis, from training to post-event insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`bg-gradient-to-br ${feature.gradient} border-border/50 hover:border-${feature.color.replace('text-', '')}/50 transition-all hover:shadow-lg hover:-translate-y-1`}
              >
                <CardContent className="p-6">
                  <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
                  <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Accelerate Your Performance?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join engineers and fans using Morizo Pro for comprehensive racing insights
          </p>
          <Button 
            size="lg" 
            variant="racing"
            onClick={() => navigate("/auth")}
            className="text-lg"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Morizo Pro. Powered by Toyota GR Cup Series Data.</p>
          <p className="mt-2">Built for the 2025 TRD Hackathon</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
