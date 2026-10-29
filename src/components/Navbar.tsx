'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bike, Handshake, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'hover:bg-amber-100' },
  { name: 'Kendaraan', href: '/vehicle', icon: Bike, color: 'hover:bg-sky-100' },
  { name: 'Pinjam-Meminjam', href: '/lend-borrow', icon: Handshake, color: 'hover:bg-purple-100' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop & Tablet Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b-[3px] border-black bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#fef08a] border-2 border-black flex items-center justify-center text-black shadow-neo-sm group-hover:rotate-6 transition-transform">
              <Sparkles className="w-5 h-5 font-black fill-black/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-black tracking-tight">
                  Daily<span className="bg-[#fed7aa] px-1 rounded border-2 border-black ml-0.5 shadow-[1.5px_1.5px_0px_0px_#000]">Flow</span>
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-[#bbf7d0] text-black border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  Online
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-600">Personal Life Assistant</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                    isActive
                      ? 'bg-[#fef08a] border-black shadow-neo-sm text-black -translate-y-0.5'
                      : `border-transparent text-slate-700 hover:border-black ${item.color} hover:text-black`
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbf8f3] border-t-[3px] border-black px-3 py-2">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-bold border-2 transition-all ${
                  isActive
                    ? 'bg-[#fef08a] border-black shadow-neo-sm text-black -translate-y-0.5'
                    : 'border-transparent text-slate-600 hover:text-black hover:border-black/50'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5 stroke-[2.2]" />
                <span className="truncate max-w-[85px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
