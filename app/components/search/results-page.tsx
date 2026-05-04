"use client"

import { useState } from "react"
import { AetherLogo, SearchBar, HeaderNav } from "./search-components"
import { 
  Search, 
  Image as ImageIcon, 
  Newspaper, 
  Video, 
  ShoppingBag, 
  MoreHorizontal,
  ExternalLink,
  ChevronDown,
  Clock,
  Filter,
  Sparkles,
  Globe,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark
} from "lucide-react"

interface SearchResultsPageProps {
  query: string
  onSearch: (query: string) => void
  onBack: () => void
}

const searchTabs = [
  { icon: Search, label: "All", active: true },
  { icon: ImageIcon, label: "Images", active: false },
  { icon: Newspaper, label: "News", active: false },
  { icon: Video, label: "Videos", active: false },
  { icon: ShoppingBag, label: "Shopping", active: false },
  { icon: MoreHorizontal, label: "More", active: false },
]

const mockResults = [
  {
    type: "featured",
    title: "What is Aether Search?",
    snippet: "Aether Search is a next-generation search engine designed to help you explore the digital universe with unprecedented speed and accuracy. Our AI-powered algorithms deliver relevant results while prioritizing your privacy.",
    url: "https://aether.search/about",
    domain: "aether.search",
  },
  {
    type: "result",
    title: "Getting Started with Aether Search - Complete Guide",
    snippet: "Learn how to make the most of Aether Search with our comprehensive guide. Discover advanced search operators, privacy features, and personalization options...",
    url: "https://docs.aether.search/getting-started",
    domain: "docs.aether.search",
    date: "3 days ago"
  },
  {
    type: "result",
    title: "Aether Search vs Traditional Search Engines - Comparison",
    snippet: "A detailed comparison of Aether Search against other major search engines. We analyze speed, privacy, result quality, and user experience across multiple metrics...",
    url: "https://techreview.com/aether-comparison",
    domain: "techreview.com",
    date: "1 week ago",
    rating: 4.8
  },
  {
    type: "result",
    title: "Privacy-First Search: How Aether Protects Your Data",
    snippet: "Understanding the privacy architecture behind Aether Search. From end-to-end encryption to zero-knowledge queries, learn how your searches stay private...",
    url: "https://privacy.aether.search/how-it-works",
    domain: "privacy.aether.search",
    date: "2 weeks ago"
  },
  {
    type: "result",
    title: "Aether Search API Documentation",
    snippet: "Complete API reference for developers looking to integrate Aether Search into their applications. Includes code examples, rate limits, and best practices...",
    url: "https://developers.aether.search/api",
    domain: "developers.aether.search",
    date: "Updated today"
  },
  {
    type: "result",
    title: "The Technology Behind Aether Search",
    snippet: "Deep dive into the cutting-edge technology powering Aether Search. Our distributed architecture processes billions of queries while maintaining sub-100ms response times...",
    url: "https://engineering.aether.search/tech-stack",
    domain: "engineering.aether.search",
    date: "5 days ago"
  },
]

const relatedSearches = [
  "aether search features",
  "aether search privacy settings",
  "aether search vs google",
  "how to use aether search",
  "aether search api",
  "aether search browser extension",
  "aether search mobile app",
  "aether search advanced operators",
]

const peopleAlsoAsk = [
  "What makes Aether Search different from other search engines?",
  "Is Aether Search completely private?",
  "How does Aether Search rank results?",
  "Can I use Aether Search for image search?",
]

export function SearchResultsPage({ query, onSearch, onBack }: SearchResultsPageProps) {
  const [searchQuery, setSearchQuery] = useState(query)
  const [activeTab, setActiveTab] = useState("All")
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-6 px-6 py-4">
          {/* Logo */}
          <button onClick={onBack} className="shrink-0">
            <AetherLogo />
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              size="compact"
            />
          </div>

          {/* Nav */}
          <HeaderNav variant="results" />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pb-2 overflow-x-auto">
          {searchTabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab.label)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeTab === tab.label 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-secondary"
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex gap-8 px-6 py-6 max-w-7xl mx-auto">
        {/* Results Column */}
        <div className="flex-1 max-w-3xl">
          {/* Results Count & Tools */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              About 1,240,000 results (0.42 seconds)
            </p>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Filter className="w-4 h-4" />
              Tools
            </button>
          </div>

          {/* AI Overview */}
          <div className="mb-8 p-6 bg-card border border-border rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">AI Overview</span>
            </div>
            <p className="text-foreground leading-relaxed mb-4">
              <strong>Aether Search</strong> is a privacy-focused search engine that uses advanced AI to deliver fast, accurate results. Unlike traditional search engines, Aether doesn&apos;t track your searches or build advertising profiles. Key features include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
              <li>Sub-100ms response times globally</li>
              <li>End-to-end encrypted search queries</li>
              <li>AI-powered result ranking without personal data</li>
              <li>Open-source transparency</li>
            </ul>
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ThumbsDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-6">
            {mockResults.map((result, i) => (
              <article key={i} className="group">
                {result.type === "featured" ? (
                  <div className="p-6 bg-card border border-primary/20 rounded-2xl hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Globe className="w-3 h-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{result.domain}</span>
                    </div>
                    <a href={result.url} className="block group">
                      <h2 className="text-xl font-semibold text-primary group-hover:underline mb-2">
                        {result.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed">{result.snippet}</p>
                    </a>
                  </div>
                ) : (
                  <div className="group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                        <Globe className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-sm text-muted-foreground">{result.domain}</span>
                      {result.date && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">{result.date}</span>
                        </>
                      )}
                    </div>
                    <a href={result.url} className="block">
                      <h3 className="text-lg font-medium text-primary group-hover:underline mb-1">
                        {result.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.snippet}</p>
                    </a>
                    {result.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-muted-foreground">{result.rating}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Bookmark className="w-3 h-3" /> Save
                      </button>
                      <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Share2 className="w-3 h-3" /> Share
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* People Also Ask */}
          <div className="mt-8 p-6 bg-card border border-border rounded-2xl">
            <h3 className="font-semibold mb-4">People also ask</h3>
            <div className="space-y-1">
              {peopleAlsoAsk.map((question, i) => (
                <button
                  key={i}
                  onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                  className="flex items-center justify-between w-full p-4 text-left hover:bg-secondary rounded-xl transition-colors"
                >
                  <span className="text-sm">{question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedQuestion === i ? "rotate-180" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Related Searches */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Related searches</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedSearches.map((search, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSearchQuery(search)
                    onSearch(search)
                  }}
                  className="flex items-center gap-3 p-4 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors text-left"
                >
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <span className="text-3xl font-bold text-primary">A</span>
            <span className="text-3xl font-bold text-foreground">e</span>
            <span className="text-3xl font-bold text-accent">t</span>
            <span className="text-3xl font-bold text-foreground">h</span>
            <span className="text-3xl font-bold text-primary">e</span>
            <span className="text-3xl font-bold text-accent">r</span>
          </div>
          <div className="flex items-center justify-center gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                  page === 1 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                {page}
              </button>
            ))}
            <button className="text-primary hover:underline">Next</button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-80">
          <div className="sticky top-32 p-6 bg-card border border-border rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground text-xl font-bold">A</span>
              </div>
              <div>
                <h4 className="font-semibold">Aether Search</h4>
                <p className="text-sm text-muted-foreground">Search Engine</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Aether Search is a next-generation, privacy-focused search engine that delivers fast, accurate results without tracking users.
            </p>
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Founded</span>
                <span>2024</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Headquarters</span>
                <span>San Francisco, CA</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span>Private</span>
              </div>
            </div>
            <a href="#" className="flex items-center gap-2 mt-4 text-sm text-primary hover:underline">
              aether.search <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8">
        <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Help</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Send feedback</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
