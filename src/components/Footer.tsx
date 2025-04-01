import Link from "next/link";
import { Search } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5" />
              <span className="font-bold text-xl">Sky Genesis Enterprise</span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
              Discover the universe of information with our custom search engine, designed for Sky Genesis Enterprise.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-lg mb-3">Products</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/search" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    Advanced Search
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    API Access
                  </Link>
                </li>
                <li>
                  <Link href="/enterprise" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    Enterprise Solutions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/docs" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t dark:border-zinc-800 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            © {currentYear} Sky Genesis Enterprise. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 text-sm">
              Terms
            </Link>
            <Link href="/cookies" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
