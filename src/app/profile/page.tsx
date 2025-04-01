"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { History, Save, Search, Star, User } from "lucide-react";

export default function ProfilePage() {
  const { authState } = useAuth();
  const { user, isAuthenticated, isLoading } = authState;
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isLoading, isAuthenticated, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not authenticated and redirecting
  if (!isAuthenticated || !user) {
    return null;
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Your personal information and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
                    <Avatar className="h-24 w-24">
                      {user.image ? (
                        <AvatarImage src={user.image} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="text-2xl">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <p className="text-zinc-600 dark:text-zinc-400">{user.email}</p>
                      <p className="text-sm text-zinc-500 mt-1">
                        Member since {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button className="w-full sm:w-auto">
                      <Save className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y dark:divide-zinc-800">
                    <li className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Search className="h-4 w-4 mr-2 text-zinc-500" />
                        <span>machine learning algorithms</span>
                      </div>
                      <span className="text-sm text-zinc-500">2 hours ago</span>
                    </li>
                    <li className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Search className="h-4 w-4 mr-2 text-zinc-500" />
                        <span>cloud computing services</span>
                      </div>
                      <span className="text-sm text-zinc-500">Yesterday</span>
                    </li>
                    <li className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Search className="h-4 w-4 mr-2 text-zinc-500" />
                        <span>cybersecurity best practices</span>
                      </div>
                      <span className="text-sm text-zinc-500">3 days ago</span>
                    </li>
                  </ul>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">View All Searches</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Saved Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>artificial intelligence trends</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>blockchain technology</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>quantum computing advances</span>
                    </li>
                  </ul>
                  <Separator className="my-4" />
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Saved Searches
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Personal Information
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Security Settings
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Notification Preferences
                      </Button>
                    </li>
                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Connected Accounts
                      </Button>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
