import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dynasty-spin.domenictommenta.chatgpt.site'),
  title: 'Dynasty Gold Rush — Strike Fantasy Gold',
  description: 'Mine 4,000+ historic fantasy football seasons, trade rookie picks, and strike fantasy gold.',
  openGraph: { title: 'Dynasty Gold Rush', description: 'Strike Fantasy Gold', images: ['/og-gold.png'] },
  twitter: { card: 'summary_large_image', title: 'Dynasty Gold Rush', description: 'Strike Fantasy Gold', images: ['/og-gold.png'] },
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
