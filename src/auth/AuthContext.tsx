import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";

interface User {
  id_user: string;
  nama_user: string;
  email: string;
  id_role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  refreshUser: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      console.log("Fetching user data...");
      const response = await api.get("/api/me");
      console.log("User data received:", response.data);
      setUser(response.data);
    } catch (error: any) {
      console.error("Failed to fetch user:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Token invalid, clearing storage...");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      console.log("Refreshing user data...");
      const response = await api.get("/api/me");
      console.log("User data refreshed:", response.data);
      setUser(response.data);
    } catch (error: any) {
      console.error("Failed to refresh user:", error);
      toast({
        title: "Error",
        description: "Failed to refresh user data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("AuthContext useEffect - token:", token ? "exists" : "null");
    if (token) {
      fetchUser();
    } else {
      console.log("No token, skipping fetchUser");
      setIsLoading(false);
    }
  }, [token]);

  const login = async (identifier: string, password: string) => {
    console.log("Login attempt for:", identifier);
    
    try {
      const response = await api.post("/api/login", { identifier, password });
      console.log("Login response:", response.data);
      
      const { token: newToken } = response.data;
      
      if (!newToken) {
        throw new Error("No token received from server");
      }
      
      console.log("Saving token to localStorage...");
      localStorage.setItem("token", newToken);
      setToken(newToken);
      
      console.log("Fetching user data after login...");
      const userResponse = await api.get("/api/me");
      console.log("User data after login:", userResponse.data);
      setUser(userResponse.data);
      
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const hasPermission = (permission: string): boolean => {
    if (!user?.permissions) {
      console.log("No permissions found for user");
      return false;
    }
    const has = user.permissions.includes(permission);
    console.log(`Permission check: ${permission} = ${has}`);
    return has;
  };

  console.log("AuthContext state:", {
    hasUser: !!user,
    hasToken: !!token,
    isLoading,
    userName: user?.nama_user,
    permissionsCount: user?.permissions?.length || 0,
  });

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, hasPermission, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};