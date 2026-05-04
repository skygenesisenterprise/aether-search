"use client"

import { useState } from "react"
import { HomePage } from "@/components/search/home-page"
import { SearchResultsPage } from "@/components/search/results-page"

type Page = "home" | "results"

export default function AetherSearch() {
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage("results")
  }

  const handleBack = () => {
    setCurrentPage("home")
    setSearchQuery("")
  }

  if (currentPage === "results") {
    return (
      <SearchResultsPage
        query={searchQuery}
        onSearch={handleSearch}
        onBack={handleBack}
      />
    )
  }

  return <HomePage onSearch={handleSearch} />
}
