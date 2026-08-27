import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  title: 'Dynasty Spin — Build the Legacy',
  description: 'Build an all-time fantasy football dynasty, trade future picks, and chase the highest team score.',
  openGraph: { title: 'Dynasty Spin', description: 'Build the Legacy', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Dynasty Spin', description: 'Build the Legacy', images: ['/og.png'] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
