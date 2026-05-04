"use client"

import { useState } from "react"
import { AetherLogo, SearchBar, HeaderNav } from "./search-components"
import { 
  Image as ImageIcon, 
  Download,
  ExternalLink,
  Filter,
  X,
  ZoomIn,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface ImagesPageProps {
  query: string
  onSearch: (query: string) => void
  onBack: () => void
}

// Generate mock image results
const generateMockImages = (query: string) => {
  const images = []
  for (let i = 0; i < 30; i++) {
    images.push({
      id: i,
      url: `https://picsum.photos/seed/${query}${i}/${300 + (i % 3) * 50}/${200 + (i % 4) * 50}`,
      title: `${query} - Image ${i + 1}`,
      source: ["unsplash.com", "pexels.com", "pixabay.com", "shutterstock.com"][i % 4],
      width: 300 + (i % 3) * 50,
      height: 200 + (i % 4) * 50,
    })
  }
  return images
}

const filterOptions = [
  { label: "All sizes", options: ["Large", "Medium", "Icon"] },
  { label: "Any color", options: ["Black & white", "Transparent", "Red", "Blue", "Green"] },
  { label: "Any type", options: ["Photo", "Illustration", "Vector", "GIF"] },
  { label: "Any time", options: ["Past 24 hours", "Past week", "Past month", "Past year"] },
]

export function ImagesPage({ query, onSearch, onBack }: ImagesPageProps) {
  const [searchQuery, setSearchQuery] = useState(query)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  const images = generateMockImages(query)

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery)
    }
  }

  const selectedImageData = selectedImage !== null ? images[selectedImage] : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-6 px-6 py-4">
          <button onClick={onBack} className="shrink-0">
            <AetherLogo />
          </button>
          <div className="flex-1 max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              size="compact"
            />
          </div>
          <HeaderNav variant="results" />
        </div>

        {/* Tabs & Filters */}
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Images
            </button>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filter Bar */}
        {showFilters && (
          <div className="flex items-center gap-3 px-6 pb-4 overflow-x-auto">
            {filterOptions.map((filter, i) => (
              <button
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-sm whitespace-nowrap transition-colors"
              >
                {filter.label}
                <ChevronRight className="w-3 h-3 rotate-90" />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Image Grid */}
      <main className="p-6">
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {images.map((image, i) => (
            <div
              key={i}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => setSelectedImage(i)}
            >
              <div className="relative overflow-hidden rounded-xl bg-secondary">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-sm font-medium text-foreground truncate">{image.title}</p>
                    <p className="text-xs text-muted-foreground">{image.source}</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-background/80 rounded-full hover:bg-background transition-colors">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Image Preview Modal */}
      {selectedImage !== null && selectedImageData && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button 
              onClick={() => setSelectedImage(null)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex h-full">
            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative">
                <button 
                  onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 p-3 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
                  disabled={selectedImage === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <img
                  src={selectedImageData.url}
                  alt={selectedImageData.title}
                  className="max-h-[80vh] max-w-full rounded-xl shadow-2xl"
                />
                <button 
                  onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 p-3 bg-secondary rounded-full hover:bg-secondary/80 transition-colors"
                  disabled={selectedImage === images.length - 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l border-border p-6 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2">{selectedImageData.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{selectedImageData.source}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Size</span>
                  <span>{selectedImageData.width} × {selectedImageData.height}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
                  <ExternalLink className="w-4 h-4" />
                  Visit Page
                </button>
                <button className="flex items-center justify-center gap-2 w-full py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">
                  <Download className="w-4 h-4" />
                  View Original
                </button>
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">
                    <Bookmark className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-4">Related images</h3>
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className="overflow-hidden rounded-lg"
                    >
                      <img src={img.url} alt={img.title} className="w-full h-20 object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
