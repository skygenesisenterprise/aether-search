"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Sun, User, Settings, Folder, FileText, Table, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { authState, logout } = useAuth();
  const { user, isAuthenticated } = authState;

  // Liste des applications
  const applications = [
    { name: "Drive", icon: <Folder className="h-4 w-4 mr-2" />, link: "https://office.skygenesisenterprise.com/drive" },
    { name: "Docs", icon: <FileText className="h-4 w-4 mr-2" />, link: "https://office.skygenesisenterprise.com/docs" },
    { name: "Sheets", icon: <Table className="h-4 w-4 mr-2" />, link: "https://office.skygenesisenterprise.com/sheets" },
    { name: "Calendar", icon: <Calendar className="h-4 w-4 mr-2" />, link: "https://office.skygenesisenterprise.com/calendar" },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem("skyGenesis_theme") || "light";
    setTheme(savedTheme as "light" | "dark");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("skyGenesis_theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string) => {
    if (!name) return "SG";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="container flex h-16 items-center justify-end px-4 md:px-6">
        {/* Thème et profil utilisateur alignés à droite */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  {isAuthenticated && user?.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : null}
                  <AvatarFallback>
                    {isAuthenticated && user ? getInitials(user.name) : "SG"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated && user ? (
                <>
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Applications</DropdownMenuLabel>
                  {applications.map((app) => (
                    <DropdownMenuItem asChild key={app.name}>
                      <Link href={app.link} className="flex items-center">
                        {app.icon}
                        {app.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
