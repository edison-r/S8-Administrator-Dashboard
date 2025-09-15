import "./globals.css";
import { inter } from "./ui/fonts";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
 
export const metadata = { 
  title: "Eventos Dashboard", 
  description: "Admin de eventos culturales" 
};

export default function RootLayout({children}: { children: React.ReactNode}){
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="grid grid-cols-12 min-h-screen">
            <aside className="col-span-12 md:col-span-2 border-r p-8 space-y-2">
              <h1 className="text-2xl font-bold"> Eventos </h1>
              <nav className="flex flex-col gap-1">
                <Link href="/" className="p-1 hover:underline">Dashboard</Link>
                <Link href="/dashboard/maps" className="p-1 hover:underline">Mapa</Link>
                <Link href="/dashboard/calendar" className="p-1 hover:underline">Calendario</Link>
                <Link href="/dashboard/charts" className="p-1 hover:underline">Charts</Link>
              </nav>
            </aside>
            <main className="col-span-12 md:col-span-10 p-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  ); 
}