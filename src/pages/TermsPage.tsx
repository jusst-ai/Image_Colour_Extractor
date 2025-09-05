import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TermsPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAccept = async () => {
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please sign in again.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ 
          terms_accepted: true, 
          terms_accepted_at: new Date().toISOString() 
        })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Terms Accepted",
        description: "Welcome to the platform!",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Error accepting terms:", error);
      toast({
        title: "Error",
        description: "Failed to accept terms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
          <CardDescription>
            Please read and accept our terms and conditions to continue using the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ScrollArea className="h-80 w-full rounded border p-4">
            <div className="space-y-4 text-sm">
              <h3 className="font-semibold">1. Acceptable Use Policy</h3>
              <p>
                By using this platform, you agree not to upload, share, or create content that contains:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nudity, pornography, or sexually explicit content</li>
                <li>Violence, gore, or graphic content depicting harm</li>
                <li>Content promoting illegal activities or criminal behavior</li>
                <li>Hate speech, harassment, or discriminatory content</li>
                <li>Content that violates intellectual property rights</li>
                <li>Spam, malicious software, or harmful code</li>
              </ul>

              <h3 className="font-semibold">2. Content Guidelines</h3>
              <p>
                All user-generated content must comply with applicable laws and regulations. 
                We reserve the right to remove content that violates these terms without notice.
              </p>

              <h3 className="font-semibold">3. Privacy Policy</h3>
              <p>
                We respect your privacy and handle your personal information in accordance with 
                applicable data protection laws. Your data will only be used for providing our services.
              </p>

              <h3 className="font-semibold">4. Termination</h3>
              <p>
                We may suspend or terminate your account if you violate these terms. 
                You may delete your account at any time through your profile settings.
              </p>

              <h3 className="font-semibold">5. Changes to Terms</h3>
              <p>
                We may update these terms from time to time. Continued use of the platform 
                constitutes acceptance of any changes.
              </p>

              <h3 className="font-semibold">6. Contact</h3>
              <p>
                If you have questions about these terms, please contact our support team.
              </p>
            </div>
          </ScrollArea>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the Terms and Conditions
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                supabase.auth.signOut();
                navigate("/");
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!agreed || isLoading}
            >
              {isLoading ? "Accepting..." : "Accept and Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;