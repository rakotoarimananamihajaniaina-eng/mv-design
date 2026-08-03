import './globals.css';
import type { Metadata } from 'next';
import AppShell from './app-shell';

export const metadata: Metadata = {
  title: 'MV DESIGN',
  description: 'Gestion commerciale — devis et factures',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-white text-gray-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
