import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientProviders from '@/components/ClientProviders';
import { AuthDebugger } from './auth-helper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SupplementScribe',
  description: 'Personalized supplement recommendations based on your health data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <AuthDebugger />
        </ClientProviders>
      </body>
    </html>
  );
} 