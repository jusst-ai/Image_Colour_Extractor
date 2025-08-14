import { Home, Compass, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", icon: Home, isActive: true },
  { title: "Explore", icon: Compass, isActive: false },
  { title: "Profile", icon: User, isActive: false },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-80 border-r border-border">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-foreground text-base font-medium leading-normal px-4 py-4">
            Color Palette
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-4">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                      item.isActive ? "bg-muted" : "hover:bg-muted/50"
                    }`}>
                      <item.icon className="h-6 w-6 text-foreground" />
                      <span className="text-foreground text-sm font-medium leading-normal">
                        {item.title}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}