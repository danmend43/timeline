import type React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RightSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RightSidebar({ className, ...props }: RightSidebarProps) {
  return (
    <aside className={cn("w-72 shrink-0 flex flex-col h-[calc(100vh-7rem)] sticky top-28", className)} {...props}>
      <div className="space-y-6 overflow-y-auto flex-grow">
        <Card className="border-0 bg-white shadow-sm rounded-3xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-gray-900">Trending Topics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              {
                category: "Trending in Technology",
                topic: "Inteligência Artificial",
                posts: "2.4k posts",
              },
              {
                category: "Trending in Brazil",
                topic: "Copa do Mundo 2026",
                posts: "1.8k posts",
              },
              {
                category: "Trending in Entertainment",
                topic: "Netflix Original",
                posts: "1.2k posts",
              },
              {
                category: "Trending in Gaming",
                topic: "PlayStation 5 Pro",
                posts: "956 posts",
              },
            ].map((item, index) => (
              <div key={index} className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
                <div className="text-xs text-gray-400 font-medium mb-1">{item.category}</div>
                <div className="font-bold text-gray-900 text-sm">{item.topic}</div>
                <div className="text-xs text-gray-500">{item.posts}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer that stays visible */}
      <footer className="mt-6 py-4 text-xs text-gray-500 border-t border-gray-200">
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-2">
          <a href="#" className="hover:underline">
            Termos de Serviço
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Política de Privacidade
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Política de Cookies
          </a>
          <span>•</span>
          <a href="#" className="hover:underline">
            Acessibilidade
          </a>
        </div>
        <p>© 2024 Bilibili, Inc. Todos os direitos reservados.</p>
      </footer>
    </aside>
  )
}
