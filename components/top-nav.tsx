"use client"
import { Bell, Search, Upload, ChevronDown, ChevronRight, ChevronLeft, Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import Link from "next/link"

type Theme = "light" | "dark" | "system"
type ColorTheme = "blue" | "purple" | "green" | "orange" | "red" | "pink"

interface ColorConfig {
  name: string
  primary: string
  primaryHover: string
  primaryLight: string
  gradient: string
}

const colorThemes: Record<ColorTheme, ColorConfig> = {
  blue: {
    name: "Azul",
    primary: "#1d9bf0",
    primaryHover: "#1a8cd8",
    primaryLight: "#1d9bf0",
    gradient: "from-blue-500 to-cyan-500",
  },
  purple: {
    name: "Roxo",
    primary: "#8b5cf6",
    primaryHover: "#7c3aed",
    primaryLight: "#8b5cf6",
    gradient: "from-purple-500 to-violet-500",
  },
  green: {
    name: "Verde",
    primary: "#10b981",
    primaryHover: "#059669",
    primaryLight: "#10b981",
    gradient: "from-green-500 to-emerald-500",
  },
  orange: {
    name: "Laranja",
    primary: "#f59e0b",
    primaryHover: "#d97706",
    primaryLight: "#f59e0b",
    gradient: "from-orange-500 to-amber-500",
  },
  red: {
    name: "Vermelho",
    primary: "#ef4444",
    primaryHover: "#dc2626",
    primaryLight: "#ef4444",
    gradient: "from-red-500 to-rose-500",
  },
  pink: {
    name: "Rosa",
    primary: "#ec4899",
    primaryHover: "#db2777",
    primaryLight: "#ec4899",
    gradient: "from-pink-500 to-rose-500",
  },
}

export function TopNav() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userMenuSection, setUserMenuSection] = useState("main")
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [theme, setTheme] = useState<Theme>("light")
  const [colorTheme, setColorTheme] = useState<ColorTheme>("blue")

  // Carregar tema e cor salvos do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    const savedColorTheme = localStorage.getItem("colorTheme") as ColorTheme

    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      setTheme("system")
      applyTheme("system")
    }

    if (savedColorTheme) {
      setColorTheme(savedColorTheme)
      applyColorTheme(savedColorTheme)
    } else {
      applyColorTheme("blue")
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    if (newTheme === "system") {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (systemPrefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    } else if (newTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }

  const applyColorTheme = (newColorTheme: ColorTheme) => {
    const root = document.documentElement
    const config = colorThemes[newColorTheme]

    // Aplicar as variáveis CSS customizadas
    root.style.setProperty("--primary-color", config.primary)
    root.style.setProperty("--primary-hover", config.primaryHover)
    root.style.setProperty("--primary-light", config.primaryLight)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const handleColorThemeChange = (newColorTheme: ColorTheme) => {
    setColorTheme(newColorTheme)
    localStorage.setItem("colorTheme", newColorTheme)
    applyColorTheme(newColorTheme)
  }

  const getThemeIcon = (themeOption: Theme) => {
    switch (themeOption) {
      case "light":
        return <Sun className="w-4 h-4" />
      case "dark":
        return <Moon className="w-4 h-4" />
      case "system":
        return <Monitor className="w-4 h-4" />
    }
  }

  const getThemeLabel = (themeOption: Theme) => {
    switch (themeOption) {
      case "light":
        return "Modo Claro"
      case "dark":
        return "Modo Escuro"
      case "system":
        return "Sistema"
    }
  }

  const currentColor = colorThemes[colorTheme]

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-3 pl-6">
                <Link href="/" className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: currentColor.primary }}
                  >
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">Bilibili</span>
                </Link>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  placeholder="Buscar..."
                  className="pl-4 pr-10 py-2 rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  style={{
                    focusBorderColor: currentColor.primary,
                    focusRingColor: currentColor.primary,
                  }}
                />
                <Button
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-white"
                  style={{
                    backgroundColor: currentColor.primary,
                    ":hover": { backgroundColor: currentColor.primaryHover },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = currentColor.primaryHover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = currentColor.primary
                  }}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="border font-medium"
                style={{
                  backgroundColor: `${currentColor.primary}10`,
                  borderColor: `${currentColor.primary}20`,
                  color: currentColor.primary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentColor.primary}20`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${currentColor.primary}10`
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Criar Post
              </Button>
              <Button variant="outline" size="sm" className="dark:border-gray-700 dark:bg-gray-800  dark:text-gray-300">
                <Bell className="w-4 h-4" />
              </Button>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-79VNDGOHYgVw2BgTQC3Ax3lPuffBwA.jpeg"
                      alt="Avatar"
                    />
                    <AvatarFallback
                      className="text-white font-semibold"
                      style={{ backgroundColor: currentColor.primary }}
                    >
                      EU
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl z-[99999] overflow-hidden">
                    {userMenuSection === "main" && (
                      <div className="p-4">
                        {/* User Info Header */}
                        <div className="flex items-center gap-3 p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg mb-2">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-79VNDGOHYgVw2BgTQC3Ax3lPuffBwA.jpeg"
                              alt="Avatar"
                            />
                            <AvatarFallback
                              className="text-white font-semibold"
                              style={{ backgroundColor: currentColor.primary }}
                            >
                              
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white">Meu Nome</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Ver seu perfil</div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                          {/* Menu Items */}
                          <button
                            onClick={() => setUserMenuSection("settings")}
                            className="w-full flex items-center justify-between p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 dark:text-white font-medium text-sm">
                              Configurações e privacidade
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("appearance")}
                            className="w-full flex items-center justify-between p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Aparência</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <button
                            onClick={() => setUserMenuSection("help")}
                            className="w-full flex items-center justify-between p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <span className="text-gray-900 dark:text-white font-medium text-sm">Ajuda e suporte</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </button>

                          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                            <button className="w-full flex items-center gap-3 p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                              <span className="text-gray-900 dark:text-white font-medium text-sm">Sair</span>
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
                          className="flex items-center gap-2 p-2 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Configurações e privacidade</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Configurações</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Privacidade</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Notificações</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Appearance Section */}
                    {userMenuSection === "appearance" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Aparência</span>
                        </button>

                        <div className="space-y-6">
                          {/* Tema */}
                          <div className="px-3 py-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tema</h4>
                            <div className="space-y-2">
                              {(["light", "dark", "system"] as Theme[]).map((themeOption) => (
                                <button
                                  key={themeOption}
                                  onClick={() => handleThemeChange(themeOption)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                    theme === themeOption
                                      ? "border"
                                      : "hover:bg-white-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                                  }`}
                                  style={
                                    theme === themeOption
                                      ? {
                                          backgroundColor: `${currentColor.primary}10`,
                                          color: currentColor.primary,
                                          borderColor: `${currentColor.primary}20`,
                                        }
                                      : {}
                                  }
                                >
                                  {getThemeIcon(themeOption)}
                                  <span className="text-sm font-medium">{getThemeLabel(themeOption)}</span>
                                  {theme === themeOption && (
                                    <div
                                      className="ml-auto w-2 h-2 rounded-full"
                                      style={{ backgroundColor: currentColor.primary }}
                                    ></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Cores */}
                          <div className="px-3 py-2">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Cor do tema</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {(Object.keys(colorThemes) as ColorTheme[]).map((color) => {
                                const config = colorThemes[color]
                                return (
                                  <button
                                    key={color}
                                    onClick={() => handleColorThemeChange(color)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:bg-white-50 dark:hover:bg-gray-700 ${
                                      colorTheme === color ? "ring-2 ring-offset-2 dark:ring-offset-gray-800" : ""
                                    }`}
                                    style={
                                      colorTheme === color
                                        ? {
                                            ringColor: config.primary,
                                          }
                                        : {}
                                    }
                                  >
                                    <div
                                      className="w-8 h-8 rounded-full shadow-sm"
                                      style={{ backgroundColor: config.primary }}
                                    ></div>
                                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                                      {config.name}
                                    </span>
                                    {colorTheme === color && (
                                      <div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: config.primary }}
                                      ></div>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Help Section */}
                    {userMenuSection === "help" && (
                      <div className="p-4">
                        <button
                          onClick={() => setUserMenuSection("main")}
                          className="flex items-center gap-2 p-2 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg mb-3 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Ajuda e suporte</span>
                        </button>

                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Central de ajuda</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Entrar em contato</span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-3 hover:bg-white-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <span className="text-gray-900 dark:text-white text-sm">Reportar problema</span>
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
            className="fixed inset-0 bg-black/20 z-[99998]"
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
