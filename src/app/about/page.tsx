import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Shield,
  Zap,
  Globe,
  Database,
  Users,
  Code
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              About Sky Genesis Enterprise Search
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              A powerful, secure, and intelligent search engine designed powered Sky Genesis Enterprise
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              At Sky Genesis Enterprise, we believe in the power of information discovery. Our custom search engine is designed to provide efficient, relevant, and secure access to the world's information, while maintaining a clean, distraction-free interface that prioritizes user privacy and data security.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              Unlike traditional search engines that track user behavior for advertising purposes, Sky Genesis Search focuses on delivering accurate results without compromising privacy. Our black-and-white minimalist design ensures a professional experience that adapts to your workflow.
            </p>
          </div>

          <Separator className="my-8" />

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    <CardTitle>Intelligent Search</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Our advanced ranking algorithm ensures the most relevant results appear at the top, saving you time and effort.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    <CardTitle>Privacy-Focused</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Your search history and personal data remain private. We use encryption and secure protocols to protect user information.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    <CardTitle>Lightning Fast</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Optimized for speed with advanced caching mechanisms and efficient web crawlers that deliver results instantly.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    <CardTitle>Global Reach</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Our search engine indexes content from around the world, providing comprehensive results regardless of location.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    <CardTitle>Backend</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Built on Node.js with Express, PostgreSQL, and optimized cloud infrastructure for scalability and reliability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    <CardTitle>Frontend</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Modern React with Next.js, featuring a responsive design that works seamlessly across devices of all sizes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                    <CardTitle>User Authentication</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Secure authentication system supporting email/password and OAuth providers for seamless account management.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Join Sky Genesis Enterprise Today</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Experience the future of search technology with Sky Genesis Enterprise. Create an account to unlock personalized features and contribute to our growing community of knowledge seekers.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
