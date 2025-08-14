import dashboardImage from "@/assets/dashboard-image.jpg";

const Dashboard = () => {
  return (
    <div className="py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to Your Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your color palettes and design projects
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <img 
            src={dashboardImage} 
            alt="Dashboard workspace"
            className="w-full h-96 object-cover"
          />
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              Your Color Workspace
            </h3>
            <p className="text-muted-foreground">
              Start creating beautiful color palettes from your images. Upload, analyze, and export with ease.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary"></div>
              <div className="w-8 h-8 rounded-full bg-accent"></div>
              <div className="w-8 h-8 rounded-full bg-muted"></div>
              <div className="w-8 h-8 rounded-full bg-secondary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;