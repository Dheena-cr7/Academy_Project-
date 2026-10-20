import type { Metadata, Viewport } from 'next';
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import ScrollReveal from '@/components/ScrollReveal';
import UtmTracker from '@/components/UtmTracker';
import MobileQuickBar from '@/components/MobileQuickBar';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0a1c33',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Kalaivani Sainik RIMC Coaching Centre | Amaravathinagar, Udumalpet',
  description:
    'Premier residential entrance exam coaching for AISSEE Sainik Schools (Class VI & IX), RIMC Dehradun, and Rashtriya Military Schools (RMS) in Amaravathinagar, Udumalpet, Tamil Nadu.',
  keywords: [
    'Sainik School Coaching Amaravathinagar',
    'AISSEE coaching centre Udumalpet',
    'RIMC Dehradun entrance preparation Tamil Nadu',
    'Rashtriya Military School RMS coaching',
    'Kalaivani Sainik Academy Amaravathi',
    'Defence school entrance training India',
  ],
  authors: [{ name: 'Kalaivani Sainik RIMC Coaching Centre' }],
  metadataBase: new URL('https://kalaivanisainikcoachingcentre.org.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kalaivani Sainik RIMC Coaching Centre | Amaravathinagar, Udumalpet',
    description:
      'Disciplined residential coaching for AISSEE Sainik Schools, RIMC Dehradun, and Rashtriya Military Schools in Amaravathinagar, Udumalpet.',
    url: 'https://kalaivanisainikcoachingcentre.org.in',
    siteName: 'Kalaivani Sainik Coaching Centre',
    images: [
      {
        url: '/images/hero_campus_academy.jpg',
        width: 1200,
        height: 630,
        alt: 'Kalaivani Sainik RIMC Coaching Centre Campus at Amaravathinagar',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${plusJakartaSans.variable}`}>
      <head>
        {/* Local Business JSON-LD Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Kalaivani Sainik RIMC Coaching Centre',
              url: 'https://kalaivanisainikcoachingcentre.org.in',
              telephone: '+919443718847',
              email: 'admissions@kalaivanisainikcoachingcentre.org.in',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Near State Bank of India, Udumalpet–Munnar Road',
                addressLocality: 'Amaravathinagar, Udumalpet',
                addressRegion: 'Tamil Nadu',
                postalCode: '642102',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 10.4389671,
                longitude: 77.2613149,
              },
              hasMap:
                'https://www.google.com/maps/place/Kalaivani+Sainik+RIMC+Coaching+Centre/@10.4389671,77.25874,17z/data=!3m1!4b1!4m6!3m5!1s0x3ba9d46d0ff1cfc9:0xe56e603aa6762c8a!8m2!3d10.4389671!4d77.2613149!16s%2Fg%2F11c7t40964?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D',
              description:
                'Independent preparatory tutorial academy offering residential coaching for AISSEE Sainik Schools, RIMC Dehradun, and RMS entrance examinations.',
              openingHours: 'Mo,Tu,We,Th,Fr,Sa 08:30-18:30',
            }),
          }}
        />
      </head>
      <body>
        <UtmTracker />
        <ScrollProgressBar />
        <ScrollReveal />
        <AnnouncementBar />
        <Header />
        <main id="main-content" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
        <MobileQuickBar />
      </body>
    </html>
  );
}
