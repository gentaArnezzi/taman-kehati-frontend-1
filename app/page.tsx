"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TreePine,
  Bird,
  Flower,
  BookOpen,
  Map,
  MessageCircle,
  Globe,
  Palette,
  Package,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButtons, HeroAuthButtons } from "@/components/auth-buttons";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
      {/* Hero Section */}
      <div className="text-center py-12 sm:py-16 relative px-4">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <AuthButtons />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
          <div className="bg-primary-500 rounded-xl sm:w-[60px] sm:h-[60px] w-[50px] h-[50px] flex items-center justify-center">
            <TreePine className="w-8 h-8 text-white sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent font-parkinsans">
            Taman Kehati
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 mb-8">
          Platform Nasional untuk Konservasi, Edukasi, dan Pemberdayaan Keanekaragaman Hayati Indonesia
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="bg-primary-500 hover:bg-primary-600">
            Jelajahi Peta
          </Button>
          <Button size="lg" variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-50">
            Direktori Taman
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-8 max-w-5xl">
        {/* Three Pillars Section */}
        <div className="text-center mb-8">
          <div className="font-bold text-lg sm:text-xl mb-2">Tiga Pilar Utama</div>
          <div className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Perlindungan habitat dan spesies endemik, penyebaran pengetahuan keanekaragaman hayati, 
            serta pemberdayaan masyarakat lokal untuk konservasi berkelanjutan
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">150+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Taman Konservasi</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">10K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Spesies Flora</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">2K+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Spesies Fauna</div>
          </Card>
          <Card className="p-4 text-center bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">50+</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Daerah Perlindungan</div>
          </Card>
        </div>

        {/* Featured Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Taman */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200/50 dark:border-green-700/30">
            <div className="flex items-center gap-3 mb-3">
              <TreePine className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-lg">Taman</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Direktori taman konservasi Indonesia</li>
              <li>• Informasi habitat dan lokasi</li>
              <li>• Peta interaktif lokasi konservasi</li>
              <li>• Statistik perlindungan</li>
            </ul>
          </Card>

          {/* Flora */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200/50 dark:border-green-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Flower className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-lg">Flora</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Database flora Indonesia</li>
              <li>• Nama ilmiah dan lokal</li>
              <li>• Status konservasi IUCN</li>
              <li>• Informasi habitat</li>
            </ul>
          </Card>

          {/* Fauna */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200/50 dark:border-green-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Bird className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-lg">Fauna</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Database fauna Indonesia</li>
              <li>• Nama ilmiah dan lokal</li>
              <li>• Status konservasi IUCN</li>
              <li>• Informasi habitat</li>
            </ul>
          </Card>

          {/* Berita */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200/50 dark:border-green-700/30">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-lg">Berita</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Update konservasi terbaru</li>
              <li>• Program perlindungan</li>
              <li>• Informasi edukasi</li>
              <li>• Kegiatan masyarakat</li>
            </ul>
          </Card>

          {/* Peta */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200/50 dark:border-green-700/30">
            <div className="flex items-center gap-3 mb-3">
              <Map className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-lg">Peta</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Peta interaktif lokasi</li>
              <li>• Lokasi taman konservasi</li>
              <li>• Zona perlindungan</li>
              <li>• Distribusi spesies</li>
            </ul>
          </Card>

          {/* Hubungi */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200/50 dark:border-green-700/30">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-lg">Hubungi</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Informasi kontak resmi</li>
              <li>• Form permintaan informasi</li>
              <li>• Kolaborasi konservasi</li>
              <li>• Laporan pelanggaran</li>
            </ul>
          </Card>
        </div>

        {/* Chatbot Section */}
        <Card className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-500" />
            Chatbot Konservasi
          </h3>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Punya pertanyaan tentang keanekaragaman hayati Indonesia? Chatbot kami siap membantu 
              dengan informasi berbasis pengetahuan tentang flora, fauna, dan taman konservasi di Indonesia.
            </p>
            <div className="flex justify-center">
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => {
                  // This will trigger the floating chatbot to open
                  const event = new CustomEvent('openFloatingChatbot');
                  window.dispatchEvent(event);
                }}
              >
                Mulai Berdiskusi
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
