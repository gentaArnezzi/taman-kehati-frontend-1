import Link from "next/link";
import { TreePine, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PublicNav, PublicMobileNav } from "@/components/public-nav";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-500 rounded-lg p-1">
              <TreePine className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              Taman Kehati
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            <PublicNav />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chatbot
          </Button>
          <ThemeToggle />
          <PublicMobileNav />
        </div>
      </div>
    </header>
  );
}