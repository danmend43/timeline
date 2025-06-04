import type React from "react"
import { cn } from "@/lib/utils"
import { Calendar, Home, LayoutDashboard, Settings, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

interface LeftSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LeftSidebar({ className, ...props }: LeftSidebarProps) {
  return (
    <aside className={cn("w-72 shrink-0 sticky top-28 h-[calc(100vh-7rem)]", className)} {...props}>
      <div className="flex h-full flex-col px-6 pb-6">
        <nav className="space-y-2">
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl bg-[#1d9bf0] px-4 py-3 text-white font-medium transition-all"
          >
            <Home className="h-5 w-5" />
            <span>Início</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 font-medium transition-all hover:bg-gray-100"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Tendências</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 font-medium transition-all hover:bg-gray-100"
          >
            <Calendar className="h-5 w-5" />
            <span>Eventos</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 font-medium transition-all hover:bg-gray-100"
          >
            <Users className="h-5 w-5" />
            <span>Comunidade</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 font-medium transition-all hover:bg-gray-100"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 font-medium transition-all hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
