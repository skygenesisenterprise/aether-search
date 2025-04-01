import SearchInterface from "@/components/SearchInterface";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-24">
        <div className="max-w-5xl w-full flex flex-col items-center">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              Sky Genesis Enterprise
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Discover the universe of information
            </p>
          </div>
          <SearchInterface />
        </div>
      </main>
      <Footer />
    </div>
  );
}
