"use client"

import { useState } from "react"
import { AetherLogo, SearchBar, QuickLinks, HeaderNav } from "./search-components"
import { Sparkles, Zap, Shield, Globe } from "lucide-react"

export function HomePage({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query)
    }
  }

  const shortcuts = [
    { icon: "🌍", label: "News", href: "#" },
    { icon: "🎬", label: "Videos", href: "#" },
    { icon: "🖼️", label: "Images", href: "#" },
    { icon: "📚", label: "Books", href: "#" },
    { icon: "🛒", label: "Shopping", href: "#" },
    { icon: "🗺️", label: "Maps", href: "#" },
    { icon: "✈️", label: "Travel", href: "#" },
    { icon: "💰", label: "Finance", href: "#" },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <a href="https://skygenesisenterprise.com/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
          <a href="https://skygenesisenterprise.com/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Products</a>
        </div>
        <HeaderNav />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150" />
            <div className="relative w-24 h-24 bg-linear-to-br from-primary via-accent to-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/20">
              <span className="text-primary-foreground text-4xl font-bold">A</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance text-center">
            <span className="text-primary">Aether</span> Search
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">Explore the digital universe</p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-8">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            size="large"
            showSuggestions={showSuggestions}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={handleSearch}
            className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
          >
            Aether Search
          </button>
          <button className="px-6 py-2.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            {"I'm Feeling Lucky"}
          </button>
        </div>

        {/* Quick Links / Shortcuts */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-3xl">
          {shortcuts.map((shortcut, i) => (
            <a
              key={i}
              href={shortcut.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-secondary transition-colors group"
            >
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {shortcut.icon}
              </div>
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{shortcut.label}</span>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="px-6 py-4 bg-secondary/50">
          <span className="text-sm text-muted-foreground">Powered by Sky Genesis Enterprise</span>
        </div>
        <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="https://skygenesisenterprise.com/advertising" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Advertising</a>
            <a href="https://skygenesisenterprise.com/business" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Business</a>
            <a href="https://skygenesisenterprise.com/how-search-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How Search Works</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://skygenesisenterprise.com/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
            <a href="https://skygenesisenterprise.com/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            <a href="https://skygenesisenterprise.com/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Settings</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function FeatureCards() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Results in milliseconds",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays yours",
      color: "text-accent"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Search the entire web",
      color: "text-primary"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
      {features.map((feature, i) => (
        <div key={i} className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors">
          <feature.icon className={`w-8 h-8 ${feature.color} mb-4`} />
          <h3 className="font-semibold mb-1">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
