import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadSection from "@/components/UploadSection";
import DashboardPaletteGrid from "@/components/DashboardPaletteGrid";
import ExploreGrid from "@/components/ExploreGrid";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("your-palettes");

  return (
    <div className="flex flex-col max-w-[960px] flex-1">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-foreground tracking-light text-[32px] font-bold leading-tight min-w-72">
          Home
        </p>
      </div>
      
      <div className="px-4 space-y-8">
        <UploadSection />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="your-palettes">Your Palettes</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>
          <TabsContent value="your-palettes" className="mt-6">
            <DashboardPaletteGrid />
          </TabsContent>
          <TabsContent value="explore" className="mt-6">
            <ExploreGrid />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;