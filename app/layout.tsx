import type { Metadata } from 'next';
import './globals.css';
import './results.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dynasty-spin.domenictommenta.chatgpt.site'),
  title: 'Dynasty Spin Royale — Spin for the Crown',
  description: 'Spin through 4,000+ historic fantasy football seasons, wager rookie picks, and build a championship dynasty.',
  openGraph: { title: 'Dynasty Spin Royale', description: 'Spin for the Crown', images: ['/og-spin-royale.png'] },
  twitter: { card: 'summary_large_image', title: 'Dynasty Spin Royale', description: 'Spin for the Crown', images: ['/og-spin-royale.png'] },
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
