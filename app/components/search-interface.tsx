"use client"

import type React from "react"

import { useState } from "react"
import { Search, Mic, ImageIcon } from "lucide-react"
import { Button } from ".//ui/button"
import { Input } from "./ui/input"

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate search - in a real app, this would navigate or fetch results
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <button className="text-sm text-foreground hover:underline">À propos</button>
          <button className="text-sm text-foreground hover:underline">Boutique</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-foreground hover:underline">Mail</button>
          <button className="text-sm text-foreground hover:underline">Images</button>
          <Button variant="default" size="sm" className="bg-foreground text-background hover:bg-foreground/90">
            Connexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-32">
        <div className="mb-8">
          <h1 className="text-7xl font-bold tracking-tight text-foreground md:text-8xl">
            Aether <span className="font-light">Search</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher sur le web..."
              className="h-12 rounded-full border-2 border-border bg-background pl-12 pr-24 text-base shadow-sm transition-shadow hover:shadow-md focus:shadow-md focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="absolute inset-y-0 right-4 flex items-center gap-3">
              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Recherche vocale"
              >
                <Mic className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Recherche par image"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Button
              type="submit"
              variant="secondary"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm"
            >
              Recherche Aether
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm"
            >
              {"J'ai de la chance"}
            </Button>
          </div>
        </form>

        {/* Language Options */}
        <div className="mt-8 text-sm text-muted-foreground">
          Recherche disponible en : <button className="text-foreground hover:underline">Français</button>
          {" · "}
          <button className="text-foreground hover:underline">English</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted">
        <div className="px-6 py-3">
          <p className="text-sm text-muted-foreground">France</p>
        </div>
        <div className="border-t border-border px-6 py-3">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-wrap justify-center gap-6">
              <button className="text-sm text-muted-foreground hover:underline">Publicité</button>
              <button className="text-sm text-muted-foreground hover:underline">Entreprise</button>
              <button className="text-sm text-muted-foreground hover:underline">Comment fonctionne la recherche</button>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="text-sm text-muted-foreground hover:underline">Confidentialité</button>
              <button className="text-sm text-muted-foreground hover:underline">Conditions</button>
              <button className="text-sm text-muted-foreground hover:underline">Paramètres</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
