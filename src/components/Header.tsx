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
import { LogOut, Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { authState, logout } = useAuth();
  const { user, isAuthenticated } = authState;

  // Initialize theme from localStorage on client side
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
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
                  Home
                </Link>
                <Link href="/search" className="font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
                  Advanced Search
                </Link>
                <Link href="/about" className="font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
                  About
                </Link>
                {isAuthenticated && (
                  <Link href="/profile" className="font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
                    My Profile
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span className="font-bold text-xl hidden md:inline-block">Sky Genesis Enterprise</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
            Home
          </Link>
          <Link href="/search" className="font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
            Advanced Search
          </Link>
          <Link href="/about" className="font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
            About
          </Link>
          {isAuthenticated && (
            <Link href="/profile" className="font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50">
              My Profile
            </Link>
          )}
        </nav>
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
