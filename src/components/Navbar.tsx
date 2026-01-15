import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/auth/AuthContext";
import api from "@/api/axios";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleName, setRoleName] = useState<string>("User");

  const userName = user?.nama_user || "User";
  const userEmail = user?.email || "user@example.com";
  const userPhoto = user?.foto_user;

  // Fetch role name
  useEffect(() => {
    const fetchRoleName = async () => {
      if (!user?.id_role) return;
      
      try {
        const response = await api.get(`/api/roles`);
        const roles = response.data || [];
        const userRole = roles.find((r: any) => r.id_role === user.id_role);
        
        if (userRole) {
          setRoleName(userRole.nama_role);
        }
      } catch (error) {
        console.error("Failed to fetch role name:", error);
      }
    };

    fetchRoleName();
  }, [user?.id_role]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    
    // Apply theme to document
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <nav className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 fixed top-0 right-0 left-0 lg:left-64 z-30">
      <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section - Mobile Menu Button + Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Hamburger Menu - Only visible on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar - Responsive */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          {/* Theme Switcher - Hidden on very small screens */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hidden sm:flex"
              >
                {getThemeIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel className="text-xs text-slate-500">
                Theme
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleThemeChange("light")}
                className="cursor-pointer"
              >
                <Sun className="w-4 h-4 mr-2" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleThemeChange("dark")}
                className="cursor-pointer"
              >
                <Moon className="w-4 h-4 mr-2" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleThemeChange("system")}
                className="cursor-pointer"
              >
                <Monitor className="w-4 h-4 mr-2" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative hidden sm:flex"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* Divider - Hidden on mobile */}
          <div className="w-px h-6 sm:h-8 bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-9 sm:h-10 px-2 sm:px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  {/* Avatar - With Photo Support */}
                  {userPhoto ? (
                    <img
                      src={`http://localhost:8080/${userPhoto}`}
                      alt={userName}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Name - Hidden on small screens */}
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white max-w-[120px] truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {roleName}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-slate-500">{userEmail}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {roleName}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Theme option visible on mobile */}
              <div className="sm:hidden">
                <DropdownMenuLabel className="text-xs text-slate-500">
                  Theme
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
                  className="cursor-pointer"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-4 h-4 mr-2" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 mr-2" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
              
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="cursor-pointer"
              >
                <User className="w-4 h-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;