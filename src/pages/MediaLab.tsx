import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { 
  Image, 
  Video, 
  Wand2, 
  Download,
  ArrowLeft,
  Sparkles,
  Loader2
} from "lucide-react";

const MediaLab = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a description for your image",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-media', {
        body: { 
          type: 'image',
          prompt: `Racing themed: ${prompt}. Ultra high resolution, professional motorsport photography style.`,
        },
      });

      if (error) throw error;

      if (data?.image) {
        setGeneratedImage(data.image);
        toast({
          title: "Image generated!",
          description: "Your racing-themed image is ready",
        });
      }
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `morizo-pro-${Date.now()}.png`;
    link.click();

    toast({
      title: "Downloaded!",
      description: "Image saved to your device",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent via-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                Media Lab
              </h1>
              <p className="text-xs text-muted-foreground">AI-Powered Creative Studio</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generation Controls */}
          <Card className="bg-card/50 backdrop-blur border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Image className="h-5 w-5 text-accent" />
                <CardTitle>Image Generation</CardTitle>
              </div>
              <CardDescription>
                Create stunning racing visuals with AI. Powered by Lovable AI.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Describe your vision</Label>
                <Textarea
                  id="prompt"
                  placeholder="e.g., A Toyota GR86 drifting through a corner at sunset, motion blur, dramatic lighting..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="bg-background/50"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !prompt.trim()}
                  className="flex-1"
                  variant="racing"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>

              {generatedImage && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Image
                </Button>
              )}

              <div className="pt-4 border-t border-border/50">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Video className="h-4 w-4 text-secondary" />
                  Video Generation (Coming Soon)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create race highlights, onboard footage simulations, and more.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview Area */}
          <Card className="bg-card/50 backdrop-blur border-accent/20">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Your generated content appears here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="aspect-video bg-background/50 rounded-lg flex items-center justify-center">
                  <LoadingSpinner message="Generating your racing masterpiece..." />
                </div>
              ) : generatedImage ? (
                <div className="space-y-3">
                  <img
                    src={generatedImage}
                    alt="Generated racing image"
                    className="w-full rounded-lg border border-border/50 shadow-lg"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Generated with Lovable AI
                  </p>
                </div>
              ) : (
                <div className="aspect-video bg-background/50 rounded-lg flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    Enter a prompt and click Generate to create racing imagery
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Prompts */}
        <Card className="mt-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg">Quick Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                "Toyota GR86 on racing circuit at golden hour",
                "Close-up of racing tires with motion blur",
                "Pit crew working on GR Cup car, dramatic lighting",
              ].map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left h-auto py-3"
                  onClick={() => setPrompt(suggestion)}
                >
                  <span className="text-xs">{suggestion}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediaLab;
