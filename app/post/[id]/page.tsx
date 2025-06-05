"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { TopNav } from "@/components/top-nav"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share2,
  ArrowLeft,
  ImageIcon,
  Smile,
  Send,
  MessageSquare,
} from "lucide-react"

interface Post {
  id: number
  user: {
    name: string
    username: string
    avatar: string
    level: number
    verified?: boolean
  }
  content: string
  time: string
  likes: number
  comments: number
  shares: number
  image?: string
  isSponsored?: boolean
  cta?: string
  url?: string
}

interface Comment {
  id: number
  user: {
    name: string
    username: string
    avatar: string
    level: number
  }
  content: string
  time: string
  likes: number
  replies?: Comment[]
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number(params.id)

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [primaryColor, setPrimaryColor] = useState("#1d9bf0")
  const [primaryHover, setPrimaryHover] = useState("#1a8cd8")

  // Scroll para o topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Função para atualizar as cores quando elas mudarem
  useEffect(() => {
    const updateColors = () => {
      const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary-color") || "#1d9bf0"
      const hover = getComputedStyle(document.documentElement).getPropertyValue("--primary-hover") || "#1a8cd8"
      setPrimaryColor(primary)
      setPrimaryHover(hover)
    }

    // Atualizar inicialmente
    updateColors()

    // Observer para mudanças nas variáveis CSS
    const observer = new MutationObserver(updateColors)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    })

    return () => observer.disconnect()
  }, [])

  const getLevelColor = (level: number) => {
    if (level >= 90) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    if (level >= 70) return "bg-gradient-to-r from-red-500 to-orange-500 text-white"
    if (level >= 50) return "bg-gradient-to-r from-yellow-500 to-amber-500 text-black"
    if (level >= 30) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
    if (level >= 10) return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
  }

  // Dados mockados para todos os posts
  const allPosts = [
    {
      id: 1,
      user: {
        name: "Cesaoo missias",
        username: "csr22",
        avatar:
          "https://i.pinimg.com/736x/88/e6/ce/88e6cec081f9ee09e7906ce93215387b.jpg",
        level: 23,
      },
      content:
        "Acabei de acordar",
      time: "2h",
      likes: 47,
      comments: 12,
      shares: 8,
      image: "https://i.pinimg.com/originals/81/79/b5/8179b530237c2c657e2b17bd4b00c02e.gif",
    },
    {
      id: 2,
      user: {
        name: "Maria Santos",
        username: "mariasantos",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pikachu-x7uzKJizbinqgaOagO5YHBRSG9uWaX.jpeg",
        level: 47,
      },
      content:
        "Participei de uma conferência sobre IA ontem e saí de lá com a mente explodindo de ideias! 🤯 A tecnologia está evoluindo tão rápido que mal conseguimos acompanhar. Quem mais esteve lá?",
      time: "5h",
      likes: 89,
      comments: 23,
      shares: 15,
    },
    {
      id: 3,
      user: {
        name: "Pedro Alves",
        username: "pedroalves",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user3-9ww4jnSm5gbb1Q0MMepQvQHE4JPNw3.jpeg",
        level: 31,
      },
      content:
        "Novo artigo no blog sobre tendências de design para 2025! ✨ Spoiler: minimalismo e cores suaves estão dominando. Link na bio para quem quiser dar uma olhada!",
      time: "1d",
      likes: 156,
      comments: 34,
      shares: 28,
      image: "https://i.pinimg.com/736x/66/8e/c4/668ec41e3a80bfaff5694c172374c462.jpg",
    },
    {
      id: 4,
      user: {
        name: "Ana Costa",
        username: "anacosta",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/red-hair-boy-QDciatAIAP8Z9IPqcaf6e6yBptyFkX.jpeg",
        level: 37,
      },
      content:
        "Bom dia pessoal! ☀️ Começando o dia com muito café e energia para mais um projeto. Como vocês estão começando a semana?",
      time: "3h",
      likes: 23,
      comments: 8,
      shares: 2,
    },
  
    {
      id: 6,
      user: {
        name: "Luiza Mendonça",
        username: "luizamendonca",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meowth-sunglasses-iZGYJfJi8QxiWlveHBjRqQLGuegVhv.jpeg",
        level: 19,
      },
      content:
        "Finalmente terminei de assistir aquela série que todo mundo estava comentando! 📺 Valeu muito a pena, agora entendo o hype. Sem spoilers, mas o final foi simplesmente perfeito!",
      time: "3h",
      likes: 72,
      comments: 18,
      shares: 5,
    },
    {
      id: 7,
      user: {
        name: "Gabriel Torres",
        username: "gabrieltorres",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/christmas-girl-fnQy1VvUkzL016Xgs06FtRYrrEMfYu.jpeg",
        level: 56,
      },
      content:
        "Alguém mais está acompanhando os Jogos Olímpicos? 🏅 As competições de natação estão sendo incríveis! Quais esportes vocês estão curtindo mais?",
      time: "6h",
      likes: 104,
      comments: 27,
      shares: 12,
      image: "https://i.pinimg.com/originals/a6/95/24/a69524a7eadd4156fef3a9eb78d24375.gif",
    },
    {
      id: 8,
      user: {
        name: "Camila Rocha",
        username: "camilarocha",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/green-hair-girl-JnVWCgMLeEeF2Y7fMdKeuU8JT0LruK.jpeg",
        level: 28,
      },
      content:
        "Dica de livro: acabei de terminar 'O Poder do Hábito' e é transformador! 📚 Se você quer entender como criar e mudar hábitos de forma eficiente, recomendo muito. Alguém já leu?",
      time: "8h",
      likes: 63,
      comments: 15,
      shares: 9,
    },
    {
      id: 12,
      user: {
        name: "Rafael Oliveira",
        username: "rafaeloliveira",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/camera-girl-cZ0wlNWz5awND6TsUCEpja2BAga1VC.jpeg",
        level: 44,
      },
      content:
        "Acabei de voltar de uma viagem incrível para o Japão! 🇯🇵 A cultura, a comida, as pessoas... tudo foi perfeito. Já estou planejando a próxima viagem. Alguém tem dicas de lugares imperdíveis?",
      time: "12h",
      likes: 234,
      comments: 67,
      shares: 23,
      image: "https://i.pinimg.com/1200x/18/86/7c/18867cb31f36820b8908b1f462ab8b70.jpg",
    },
  ]

  // Simular carregamento de dados
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true)

      // Simular delay de carregamento
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Buscar o post pelo ID
      const foundPost = allPosts.find((p) => p.id === postId)

      if (foundPost) {
        setPost(foundPost)
        // Não carregar comentários - deixar vazio
        setComments([])
      } else {
        setPost(null)
      }

      setIsLoading(false)
    }

    fetchPost()
  }, [postId])

  const handleBack = () => {
    router.back()
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: {
          name: "Meu Nome",
          username: "meunome",
          avatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-79VNDGOHYgVw2BgTQC3Ax3lPuffBwA.jpeg",
          level: 25,
        },
        content: newComment,
        time: "agora",
        likes: 0,
      }
      setComments([comment, ...comments])
      setNewComment("")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <TopNav />
        <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
          <LeftSidebar className="hidden md:block" />
          <div className="flex-1">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
              <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                </CardContent>
              </Card>
            </div>
          </div>
          <RightSidebar className="hidden lg:block" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <TopNav />
        <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
          <LeftSidebar className="hidden md:block" />
          <div className="flex-1">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post não encontrado</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                O post que você está procurando não existe ou foi removido.
              </p>
              <Button
                onClick={handleBack}
                className="text-white font-semibold"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor
                }}
              >
                Voltar
              </Button>
            </div>
          </div>
          <RightSidebar className="hidden lg:block" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3] dark:bg-gray-900">
      <TopNav />
      <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
        <LeftSidebar className="hidden md:block" />

        <div className="flex-1 space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          {/* Main Post */}
          <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
            <CardContent className="pb-4 px-6 pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold">
                      {post.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 dark:text-white">{post.user.name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevelColor(post.user.level)}`}>
                        Lv.{post.user.level}
                      </span>
                      {post.user.verified && (
                        <div
                          className="rounded-full p-0.5 flex items-center justify-center"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                            <path
                              fillRule="evenodd"
                              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      <p className="text-gray-500 dark:text-gray-400">@{post.user.username}</p>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <p className="text-gray-500 dark:text-gray-400">{post.time}</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
            </CardContent>

            <CardContent className="pb-4 px-6">
              <div className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-lg">
                {post.content}
              </div>
              {post.image && (
                <div className="rounded-2xl overflow-hidden">
                  <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-96 object-cover" />
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
              <div className="flex w-full justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 dark:text-gray-400 rounded-full"
                  style={{
                    ":hover": {
                      color: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor
                    e.currentTarget.style.backgroundColor = `${primaryColor}10`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = ""
                    e.currentTarget.style.backgroundColor = ""
                  }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="font-medium">{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-full"
                >
                  <Repeat2 className="h-4 w-4" />
                  <span className="font-medium">{post.shares}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-full"
                >
                  <Heart className="h-4 w-4" />
                  <span className="font-medium">{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 dark:text-gray-400 rounded-full"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = primaryColor
                    e.currentTarget.style.backgroundColor = `${primaryColor}10`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = ""
                    e.currentTarget.style.backgroundColor = ""
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Comment Form */}
          <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
            <CardContent className="pb-2 px-6 pt-6">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-79VNDGOHYgVw2BgTQC3Ax3lPuffBwA.jpeg"
                    alt="Avatar"
                  />
                  <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: primaryColor }}>
                    EU
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Escreva um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-16 resize-none border-0 p-0 text-base placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:border-0 focus-visible:outline-none bg-transparent text-gray-900 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        handleCommentSubmit()
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between px-6 py-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ImageIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Smile className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim()}
                className="rounded-full text-white font-semibold px-6 flex items-center gap-2"
                style={{ backgroundColor: primaryColor }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = primaryHover
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = primaryColor
                  }
                }}
              >
                <Send className="h-4 w-4" />
                Comentar
              </Button>
            </CardFooter>
          </Card>

          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Comentários ({comments.length})</h3>

            {comments.length === 0 ? (
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-none rounded-3xl">
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Ainda não há comentários</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Seja o primeiro a comentar neste post! 
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        const textarea = document.querySelector("textarea")
                        if (textarea) {
                          textarea.focus()
                          textarea.scrollIntoView({ behavior: "smooth", block: "center" })
                        }
                      }}
                      className="text-white font-semibold px-6 py-2 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = primaryHover
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = primaryColor
                      }}
                    >
                      Escrever comentário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-3xl"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                          <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold">
                            {comment.user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 dark:text-white">{comment.user.name}</p>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevelColor(comment.user.level)}`}
                            >
                              Lv.{comment.user.level}
                            </span>
                            <p className="text-gray-500 dark:text-gray-400">@{comment.user.username}</p>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <p className="text-gray-500 dark:text-gray-400">{comment.time}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{comment.content}</p>
                  </CardContent>

                  <CardFooter className="border-t border-gray-100 dark:border-gray-700 px-6 py-3">
                    <div className="flex items-center gap-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-full"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="font-medium">{comment.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 dark:text-gray-400 rounded-full"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = primaryColor
                          e.currentTarget.style.backgroundColor = `${primaryColor}10`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = ""
                          e.currentTarget.style.backgroundColor = ""
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="font-medium">Responder</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>

        <RightSidebar className="hidden lg:block" />
      </div>
    </div>
  )
}
