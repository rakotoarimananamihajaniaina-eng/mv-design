'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutGrid, FileText, Users, Package, BarChart3, Settings, Menu, X, Bell, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutGrid },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/catalogue', label: 'Catalogue', icon: Package },
  { href: '/statistiques', label: 'Statistiques', icon: BarChart3 },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex text-gray-900">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:static z-40 top-0 left-0 h-full w-64 bg-gray-900 text-slate-200 flex flex-col transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-2 px-6 h-16 border-b border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm">MV</div>
          <div>
            <p className="font-semibold text-white leading-tight text-sm">MV DESIGN</p>
            <p className="text-xs text-slate-400 leading-tight">Gestion commerciale</p>
          </div>
          <button className="ml-auto lg:hidden text-slate-400" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm transition-colors ${active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">AD</div>
          <div className="min-w-0">
            <p className="text-sm text-white truncate">Administrateur</p>
            <button className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
              <LogOut size={12} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-600" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <p className="text-sm text-gray-400">
              Bonjour, <span className="text-gray-900 font-semibold">MV DESIGN</span>
            </p>
          </div>
          <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8 bg-white">{children}</main>
      </div>
    </div>
  );
}
