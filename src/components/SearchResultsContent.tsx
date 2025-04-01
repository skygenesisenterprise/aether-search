"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ExternalLink,
  Filter,
  Search,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { FilterOptions } from "@/components/FilterOptions";
import { Card } from "@/components/ui/card";
import { SearchResult } from "@/lib/types";

// Mock search results data
const generateMockResults = (query: string, count = 10) => {
  const domains = [
    "example.com",
    "skygenesis.org",
    "enterprise-tech.com",
    "dataanalysis.io",
    "cloudcomputing.net",
    "techblog.dev",
    "airesearch.org",
    "developer-network.com",
    "securityfocus.net",
    "digitaltrends.com",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `result-${i}`,
    title: `${query} - Professional Research & Analysis ${i + 1}`,
    url: `https://www.${domains[i % domains.length]}/articles/${query.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
    description:
      `Comprehensive information about ${query} including detailed analysis, research findings, ` +
      `statistical data, and expert insights. This resource covers everything you need to know about ${query} and related topics.`,
    datePublished: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
};

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState<SearchResult[]>([]);
  const resultsPerPage = 10;

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      // In a real application, this would be an API call
      setResults(generateMockResults(query, 50));
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // This would navigate to the search page with the updated query
    window.history.pushState(
      {},
      "",
      `/search?q=${encodeURIComponent(searchQuery)}`
    );
    setResults(generateMockResults(searchQuery, 50));
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search the web..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </form>

        {showFilters && (
          <div className="mt-4">
            <FilterOptions />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mb-2 text-zinc-600 dark:text-zinc-400">
          About {results.length} results found for &quot;{query}&quot;
        </div>
      )}

      <div className="space-y-6">
        {paginatedResults.map((result) => (
          <Card key={result.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col">
              <div className="text-sm text-zinc-500 mb-1 flex items-center">
                {new URL(result.url).hostname}
                <ExternalLink className="h-3 w-3 ml-1" />
              </div>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium hover:underline mb-1 text-zinc-900 dark:text-zinc-50"
              >
                {result.title}
              </a>
              <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                {result.description}
              </p>
              <div className="flex items-center text-sm text-zinc-500">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(result.datePublished).toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}

        {results.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-xl font-medium mb-2">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              Try different keywords or check your spelling
            </p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = currentPage <= 3
                ? i + 1
                : currentPage + i - 2;

              if (pageNumber > totalPages) return null;

              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className="w-10"
                >
                  {pageNumber}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="mx-1">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </main>
  );
}
