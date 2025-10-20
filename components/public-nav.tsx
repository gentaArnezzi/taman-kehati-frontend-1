"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TreePine, Mountain, Bird, Flower, BookOpen, Map, MessageCircle, Menu, Newspaper, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Beranda", href: "/", icon: TreePine },
  { name: "Taman", href: "/taman", icon: Mountain },
  { name: "Flora", href: "/flora", icon: Flower },
  { name: "Fauna", href: "/fauna", icon: Bird },
  { name: "Artikel", href: "/artikel", icon: Newspaper },
  { name: "Peta Interaktif", href: "/peta", icon: Map },
  { name: "Indeks Keanekaragaman", href: "/indeks", icon: TrendingUp },
  { name: "Hubungi", href: "/kontak", icon: MessageCircle },
];

export function PublicNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={`h-9 px-3 rounded-md ${isActive ? "bg-primary text-primary-foreground" : ""}`}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}

export function PublicMobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex flex-col gap-4 pt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActive ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}