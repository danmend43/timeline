"use client"
import type React from "react"
import { cn } from "@/lib/utils"
import { Calendar, Home, LayoutDashboard, Settings, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface LeftSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LeftSidebar({ className, ...props }: LeftSidebarProps) {
  const [primaryColor, setPrimaryColor] = useState("#1d9bf0")

  useEffect(() => {
    // Função para atualizar a cor quando ela mudar
    const updateColor = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue("--primary-color") || "#1d9bf0"
      setPrimaryColor(color)
    }

    // Atualizar inicialmente
    updateColor()

    // Observer para mudanças nas variáveis CSS
    const observer = new MutationObserver(updateColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <aside className={cn("w-72 shrink-0 sticky top-28 h-[calc(100vh-7rem)]", className)} {...props}>
      <div className="flex h-full flex-col px-6 pb-6">
        <nav className="space-y-2">
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-white font-medium transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <Home className="h-5 w-5" />
            <span>Início</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 dark:text-gray-300 font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Tendências</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 dark:text-gray-300 font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Calendar className="h-5 w-5" />
            <span>Eventos</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 dark:text-gray-300 font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Users className="h-5 w-5" />
            <span>Comunidade</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 dark:text-gray-300 font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 rounded-2xl px-4 py-3 text-gray-600 dark:text-gray-300 font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
