"use client"
import { Bell, Search, Upload, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import Link from "next/link"

export function TopNav() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userMenuSection, setUserMenuSection] = useState("main")
  const [showMegaMenu, setShowMegaMenu] = useState(false)

  const megaMenuCategories = [
    {
      title: "Navegação",
      description: "Navegue pelas principais seções da plataforma",
      items: [
        { name: "Início", href: "#", description: "Página inicial com conteúdo personalizado" },
        { name: "Explorar", href: "#", description: "Descubra novos criadores e conteúdos" },
        { name: "Trending", href: "#", description: "Veja o que está em alta agora" },
        { name: "Comunidade", href: "#", description: "Conecte-se com outros usuários" },
      ],
    },
    {
      title: "Categorias",
      description: "Explore conteúdo por categoria de interesse",
      items: [
        { name: "Anime", href: "#", description: "Reviews, análises e discussões sobre anime" },
        { name: "Tecnologia", href: "#", description: "Tutoriais e novidades do mundo tech" },
        { name: "Jogos", href: "#", description: "Gameplay, reviews e dicas de jogos" },
        { name: "Música", href: "#", description: "Covers, análises e descobertas musicais" },
      ],
    },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-3 pl-6">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1d9bf0] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Bilibili</span>
                </Link>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  placeholder="Buscar..."
                  className="pl-4 pr-10 py-2 rounded-full border-gray-200 focus:border-[#1d9bf0] focus:ring-[#1d9bf0]"
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8]"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button className="bg-[#1d9bf0]/10 border-[#1d9bf0]/20 text-[#1d9bf0] hover:bg-[#1d9bf0]/20 border">
                <Upload className="w-4 h-4 mr-2" />
                Criar Post
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 hover:bg-gray-100 rounded-lg p-1 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-53KihlqphLkgA4FU5xkkyJcCkvogK2.jpeg"
                      alt="Avatar"
                    />
                    <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">EU</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3 h-3 text-gray-600" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {userMenuSection === "main" && (
                      <div className="p-4">
                        {/* User Info Header */}
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg mb-2">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-53KihlqphLkgA4FU5xkkyJcCkvogK2.jpeg"
                              alt="Avatar"
                            />
                            <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">EU</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">Meu Nome</div>
                            <div className="text-sm text-gray-600">Ver seu perfil</div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          {/* Menu Items */}
                          <button
                            onClick={() => setUserMenuSection("settings")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 font-medium text-sm">Configurações e privacidade</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("help")}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 font-medium text-sm">Ajuda e suporte</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                              <span className="text-gray-900 font-medium text-sm">Sair</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Settings Section */}
                    {userMenuSection === "settings" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600 text-sm">Configurações e privacidade</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-900 text-sm">Configurações</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-900 text-sm">Privacidade</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-900 text-sm">Notificações</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Help Section */}
                    {userMenuSection === "help" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-600 text-sm">Ajuda e suporte</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-900 text-sm">Central de ajuda</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-900 text-sm">Entrar em contato</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-900 text-sm">Reportar problema</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay para fechar os menus */}
        {(showMegaMenu || showUserMenu) && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => {
              setShowMegaMenu(false)
              setShowUserMenu(false)
              setUserMenuSection("main")
            }}
          />
        )}
      </header>
    </>
  )
}
