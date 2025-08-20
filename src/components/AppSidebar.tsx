import { Home, Compass, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
  { title: "Home", icon: Home, path: "/" },
  { title: "Explore", icon: Compass, path: "/explore" },
  { title: "Profile", icon: User, path: "/profile" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

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
                    <div 
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                        location.pathname === item.path ? "bg-muted" : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
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