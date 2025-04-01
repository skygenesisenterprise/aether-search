"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowRight, ArrowLeft } from "lucide-react";
import { FilterOptions } from "@/components/FilterOptions";
import { Card } from "@/components/ui/card";
import { SearchResult } from "@/lib/types";

export default function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false); // Nouvel état
  const resultsPerPage = 10;

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      fetchResults(query);
      setIsSearchPerformed(true); // Marquer la recherche comme effectuée
    }
  }, [query]);

  const fetchResults = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`);
    fetchResults(searchQuery);
    setIsSearchPerformed(true); // Marquer la recherche comme effectuée
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Barre de recherche */}
      <div
        className={`mb-6 transition-all ${
          isSearchPerformed
            ? "fixed top-20 left-4 w-1/2 z-50 px-4"
            : "relative w-1/3 mx-auto"
        }`}
      >
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search the web..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {showFilters && (
          <div className="mt-4">
            <FilterOptions />
          </div>
        )}
      </div>

      {/* Résultats de recherche */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : results.length > 0 ? (
        <div className="space-y-6">
          {paginatedResults.map((result) => (
            <Card key={result.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col">
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
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl font-medium mb-2">
            No results found for &quot;{query}&quot;
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {/* Pagination */}
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
