"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  FileText,
  Image,
  Link2,
  Mic,
  Search,
  Settings,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { FilterOptions } from "@/components/FilterOptions";

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    const encodedSearchQuery = encodeURIComponent(searchQuery);
    router.push(`/search?q=${encodedSearchQuery}`);
  };

  const handleSpeechRecognition = () => {
    // Mock functionality
    toast.info("Voice search coming soon!");
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="relative mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search the web..."
              className="pl-10 pr-20 py-6 text-lg rounded-full border-zinc-300 dark:border-zinc-700 focus-visible:ring-zinc-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleSpeechRecognition}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-zinc-600 dark:text-zinc-400"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Advanced Filters"}
            </Button>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-zinc-600 dark:text-zinc-400"
                  >
                    Search Type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Image className="h-4 w-4 mr-2" />
                    Images
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Documents
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    Videos
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Link2 className="h-4 w-4 mr-2" />
                    Links
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {showFilters && <FilterOptions />}
        </form>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 text-center">
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-md transition-shadow">
          <h3 className="font-medium mb-2">Quick Search</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Simple and fast search across the web
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-md transition-shadow">
          <h3 className="font-medium mb-2">Advanced Filters</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Narrow results by date, file type, and more
          </p>
        </div>
        <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-md transition-shadow">
          <h3 className="font-medium mb-2">AI-Powered</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Intelligent ranking and relevant suggestions
          </p>
        </div>
      </div>
    </div>
  );
}
