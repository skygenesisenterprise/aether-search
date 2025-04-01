"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, AuthState } from "@/lib/types";
import { toast } from "sonner";

// Default auth state
const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Create context
const AuthContext = createContext<{
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  oauthLogin: (provider: string) => Promise<boolean>;
}>({
  authState: defaultAuthState,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  oauthLogin: async () => false,
});

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  // Check if user is already logged in (e.g., from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("skyGenesis_user");
        if (storedUser) {
          const user = JSON.parse(storedUser) as User;
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            ...defaultAuthState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setAuthState({
          ...defaultAuthState,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're mocking the authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login if email contains "test" or "admin"
      if (email.includes("test") || email.includes("admin")) {
        const mockUser: User = {
          id: "user-123",
          name: email.split("@")[0],
          email,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Store user in localStorage
        localStorage.setItem("skyGenesis_user", JSON.stringify(mockUser));

        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      }

      // Mock login failure
      toast.error("Invalid credentials");
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return false;
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're mocking the registration
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful registration
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // In a real app, you would not store the user in localStorage at registration
      // This would be handled on the server side. Here it's just for demo purposes.

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // In a real app, this would include an API call to invalidate the session
      // For demo purposes, we're just clearing localStorage
      localStorage.removeItem("skyGenesis_user");

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      toast.success("You have been logged out");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // OAuth login function
  const oauthLogin = async (provider: string): Promise<boolean> => {
    try {
      // In a real app, this would redirect to the OAuth provider
      // For demo purposes, we're mocking the authentication
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      const mockUser: User = {
        id: `oauth-user-${Date.now()}`,
        name: `${provider} User`,
        email: `user-${Date.now()}@${provider.toLowerCase()}.com`,
        image: `https://ui-avatars.com/api/?name=${provider}+User&background=random`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Store user in localStorage
      localStorage.setItem("skyGenesis_user", JSON.stringify(mockUser));

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error(`${provider} login failed. Please try again.`);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        oauthLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
