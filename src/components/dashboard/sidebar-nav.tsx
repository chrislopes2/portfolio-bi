'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings } from 'lucide-react'

export function SidebarNav() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Configurações', href: '/dashboard/settings', icon: Settings, exact: false }
  ]

  return (
    <nav className="flex-1 p-4 space-y-2">
      {navItems.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href)
        const Icon = item.icon
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm border ${
              isActive 
                ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
            }`}
          >
            <Icon className="w-4 h-4" />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
