import dashboardImage from "@/assets/dashboard-image.jpg";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="@container">
        <div className="@[480px]:p-4">
          <div
            className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4 relative overflow-hidden shadow-medium"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.5) 100%), url(${dashboardImage})`
            }}
          >
            <div className="flex flex-col gap-4 text-center max-w-4xl">
              <h1 className="text-white text-4xl font-black leading-tight tracking-tight @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-tight">
                Your Color Palette Dashboard
              </h1>
              <h2 className="text-white/90 text-lg font-medium leading-relaxed @[480px]:text-xl @[480px]:font-medium @[480px]:leading-relaxed">
                Manage and create beautiful color palettes from your uploaded images.
              </h2>
            </div>
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your palettes..."
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <Button 
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-tight">Your Recent Project</h2>
          <Button variant="ghost" className="text-primary hover:text-primary-hover">
            View All
          </Button>
        </div>
        
        <div className="max-w-[300px]">
          <div className="flex flex-col gap-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                backgroundImage: `url(${dashboardImage})`
              }}
            ></div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Abstract Workspace</h3>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary"></div>
                <div className="w-6 h-6 rounded-full bg-accent"></div>
                <div className="w-6 h-6 rounded-full bg-muted"></div>
                <div className="w-6 h-6 rounded-full bg-secondary"></div>
                <div className="w-6 h-6 rounded-full bg-primary-hover"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;