import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Header = ({ isLoggedIn, onLogin, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      onLogout();
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border px-10 py-4 bg-card">
      <div className="flex items-center gap-4 text-foreground">
        <div className="size-8">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="gradient-primary rounded-lg p-1">
            <path
              d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
              fill="white"
            />
          </svg>
        </div>
        <h2 className="text-foreground text-xl font-bold leading-tight tracking-tight">
          Color Palette Extractor
        </h2>
      </div>
      <Button 
        variant="default" 
        className="transition-smooth hover:shadow-soft"
        onClick={handleAuthClick}
      >
        {isLoggedIn ? "Logout" : "Login"}
      </Button>
    </header>
  );
};

export default Header;