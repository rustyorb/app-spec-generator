import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { saveApiKey, getApiKey, removeApiKey } from "@/utils/storage";
import { generateSpecification } from "@/utils/claude";

const Index = () => {
  const [apiKey, setApiKey] = useState(getApiKey() || "");
  const [appDescription, setAppDescription] = useState("");
  const [specification, setSpecification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }
    saveApiKey(apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
  };

  const handleRemoveApiKey = () => {
    removeApiKey();
    setApiKey("");
    toast({
      title: "Success",
      description: "API key removed successfully",
    });
  };

  const handleGenerate = async () => {
    if (!appDescription.trim()) {
      toast({
        title: "Error",
        description: "Please enter an app description",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateSpecification(appDescription);
      setSpecification(result);
      toast({
        title: "Success",
        description: "Specification generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate specification. Please check your API key and try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Claude API Configuration</CardTitle>
          <CardDescription>Enter your Anthropic API key to use Claude</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              type="password"
              placeholder="Enter your Claude API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey}>Save Key</Button>
            <Button variant="destructive" onClick={handleRemoveApiKey}>Remove Key</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Specification Generator</CardTitle>
          <CardDescription>Enter your app idea and get a detailed specification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your app idea..."
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !apiKey}
            className="w-full"
          >
            {isLoading ? "Generating..." : "Generate Specification"}
          </Button>
          {specification && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Generated Specification:</h3>
              <div className="bg-muted p-4 rounded-lg whitespace-pre-wrap">
                {specification}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;