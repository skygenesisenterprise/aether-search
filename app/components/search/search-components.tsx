"use client"

import { Search, Mic, Camera, Grid3X3, User, Settings, Clock, TrendingUp, X } from "lucide-react"

export function AetherLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
        <div className="relative w-8 h-8 bg-linear-to-br from-primary to-accent rounded-full flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">A</span>
        </div>
      </div>
      <span className="text-xl font-semibold tracking-tight">Aether</span>
    </div>
  )
}

export function SearchBar({ 
  value, 
  onChange, 
  onSearch,
  size = "large",
  showSuggestions = false,
  onFocus,
  onBlur,
  autoFocus = false
}: { 
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  size?: "large" | "compact"
  showSuggestions?: boolean
  onFocus?: () => void
  onBlur?: () => void
  autoFocus?: boolean
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch()
    }
  }

  const isLarge = size === "large"

  return (
    <div className="relative w-full">
      <div className={`
        flex items-center gap-3 w-full bg-secondary border border-border rounded-full
        transition-all duration-200 hover:bg-secondary/80 hover:shadow-lg hover:shadow-primary/5
        focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/10
        ${isLarge ? "px-5 py-4" : "px-4 py-2.5"}
      `}>
        <Search className={`text-muted-foreground shrink-0 ${isLarge ? "w-5 h-5" : "w-4 h-4"}`} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
          placeholder="Search the digital cosmos..."
          className={`
            flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground
            ${isLarge ? "text-lg" : "text-sm"}
          `}
        />
        {value && (
          <button 
            onClick={() => onChange("")}
            className="p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <div className="h-6 w-px bg-border" />
        <button className="p-1.5 hover:bg-muted rounded-full transition-colors" title="Voice search">
          <Mic className={`text-primary ${isLarge ? "w-5 h-5" : "w-4 h-4"}`} />
        </button>
        <button className="p-1.5 hover:bg-muted rounded-full transition-colors" title="Image search">
          <Camera className={`text-accent ${isLarge ? "w-5 h-5" : "w-4 h-4"}`} />
        </button>
      </div>

      {showSuggestions && value && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
          <div className="p-2">
            {["artificial intelligence", "astronomy facts", "architecture design", "ancient history"].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  onChange(suggestion)
                  onSearch()
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-secondary rounded-xl transition-colors"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function QuickLinks() {
  const links = [
    { icon: Clock, label: "Recent", color: "text-primary" },
    { icon: TrendingUp, label: "Trending", color: "text-accent" },
  ]

  return (
    <div className="flex items-center gap-4">
      {links.map((link, i) => (
        <button
          key={i}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <link.icon className={`w-4 h-4 ${link.color}`} />
          <span className="text-sm text-muted-foreground">{link.label}</span>
        </button>
      ))}
    </div>
  )
}

export function HeaderNav({ 
  onMenuClick, 
  variant = "home" 
}: { 
  onMenuClick?: () => void
  variant?: "home" | "results"
}) {
  return (
    <nav className="flex items-center gap-4">
      <button className="p-2 hover:bg-secondary rounded-full transition-colors" title="Apps">
        <Grid3X3 className="w-5 h-5 text-muted-foreground" />
      </button>
      <button className="p-2 hover:bg-secondary rounded-full transition-colors" title="Settings">
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>
      <button className="w-9 h-9 bg-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
        <User className="w-5 h-5 text-primary-foreground" />
      </button>
    </nav>
  )
}
