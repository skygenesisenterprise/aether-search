"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";
import SearchResultsContent from "@/components/SearchResultsContent";

export default function SearchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <Header />
      <Suspense fallback={
        <div className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-4">Loading search results...</p>
          </div>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
