import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Quicksand, Playfair_Display, Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  title: 'Habitoo - La Nouvelle Façon de Se Loger',
  description: "Plateforme immobilière ultra-premium dédiée à l'Afrique de l'Ouest et Centrale (Abidjan, Brazzaville, Kinshasa). Audits physiques certifiés, visites sous séquestre et conciergerie privée.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${quicksand.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="antialiased overflow-x-clip min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
