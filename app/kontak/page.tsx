import { Phone, Mail, MapPin, MessageCircle, User, Building2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent mb-3">
            Hubungi Kami
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Informasi kontak resmi dan form permintaan informasi terkait konservasi keanekaragaman hayati Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Alamat Kantor</h3>
                  <p className="text-sm text-muted-foreground">
                    Jl. D.I. Panjaitan No. 9, Rawamangun, Jakarta Timur<br />
                    DKI Jakarta, Indonesia
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Telepon</h3>
                  <p className="text-sm text-muted-foreground">+62 21 4891 6388</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">info@tamankehati.id</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Jam Operasional</h3>
                  <p className="text-sm text-muted-foreground">
                    Senin - Jumat: 08.00 - 16.00 WIB<br />
                    Sabtu - Minggu: Libur Nasional
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Formulir Kontak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="text-sm font-medium mb-1 block">Nama Depan</label>
                    <Input id="firstName" placeholder="Nama depan Anda" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-sm font-medium mb-1 block">Nama Belakang</label>
                    <Input id="lastName" placeholder="Nama belakang Anda" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-1 block">Email</label>
                  <Input id="email" type="email" placeholder="email@contoh.com" />
                </div>
                
                <div>
                  <label htmlFor="subject" className="text-sm font-medium mb-1 block">Subjek</label>
                  <Input id="subject" placeholder="Tulis subjek pesan" />
                </div>
                
                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-1 block">Pesan</label>
                  <Textarea 
                    id="message" 
                    placeholder="Tulis pesan Anda di sini..." 
                    rows={5}
                  />
                </div>
                
                <Button className="w-full">Kirim Pesan</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Kolaborasi Konservasi</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Tertarik untuk berkolaborasi dalam program konservasi atau memiliki informasi 
                tentang keanekaragaman hayati Indonesia? Kami siap menjalin kerja sama dengan 
                berbagai pihak untuk mendukung konservasi keanekaragaman hayati Indonesia.
              </p>
              <div className="flex justify-center">
                <Button variant="outline">Ajukan Kolaborasi</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}