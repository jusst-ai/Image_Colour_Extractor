import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Dashboard from "@/components/Dashboard";
import ExplorePage from "@/pages/ExplorePage";
import ProfileContent from "@/components/ProfileContent";

const AuthenticatedLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

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