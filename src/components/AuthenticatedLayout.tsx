import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Dashboard from "@/components/Dashboard";
import ExplorePage from "@/pages/ExplorePage";
import ProfileContent from "@/components/ProfileContent";
import { useEffect, useState } from "react";

const AuthenticatedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingTerms, setIsCheckingTerms] = useState(true);

  useEffect(() => {
    const checkTermsAcceptance = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("terms_accepted")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error checking terms:", error);
          return;
        }

        if (!profile?.terms_accepted) {
          navigate("/terms");
          return;
        }
      } catch (error) {
        console.error("Error checking terms acceptance:", error);
      } finally {
        setIsCheckingTerms(false);
      }
    };

    checkTermsAcceptance();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/explore':
        return <ExplorePage />;
      case '/profile':
        return <ProfileContent />;
      default:
        return <Dashboard />;
    }
  };

  if (isCheckingTerms) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="h-16 flex items-center justify-between border-b border-border px-6">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-semibold">Color Palette App</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="transition-smooth hover:bg-destructive hover:text-destructive-foreground"
            >
              Logout
            </Button>
          </header>
          <main className="flex-1">
            <div className="gap-1 px-6 flex flex-1 justify-center py-5">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;