"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, MessageCircle, MoreHorizontal, Repeat2, Share2, Smile } from "lucide-react"

export default function SinglePostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<any[]>([])

  // Scroll para o topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Simular carregamento do post
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      // Simular uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Todos os posts disponíveis (mesmos da timeline)
      const allPosts = [
        {
          id: "2",
          user: {
            name: "Maria Santos",
            username: "mariasantos",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pikachu-68KUL5cz0UXZWNgvX312JwkX9BI62r.jpeg",
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
          id: "3",
          user: {
            name: "Felipe campos de futebol",
            username: "stindll",
            avatar:
              "https://i.pinimg.com/736x/33/f0/9b/33f09bcf441c9be7ac55af365921bd11.jpg",
            level: 1,
          },
          content:
            "oi?",
          time: "1d",
          likes: 156,
          comments: 34,
          shares: 28,
          image: "https://i.pinimg.com/1200x/8f/38/8e/8f388ee83be2782215f9c931b5d3b67b.jpg",
        },

        
        {
          id: "4",
          user: {
            name: "Ana Costa",
            username: "anacosta",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/red-hair-boy-05fuY1tOxs8pxQzA31IMeIZIhhfi9A.jpeg",
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
          id: "6",
          user: {
            name: "Luiza Mendonça",
            username: "luizamendonca",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meowth-sunglasses-ic1bFAdbLemetHHuJ0TiMwZanKVmnl.jpeg",
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
          id: "7",
          user: {
            name: "Gabriel Torres",
            username: "gabrieltorres",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/christmas-girl-ZhalqmJexSVCKYfHel0F1cs5glptAn.jpeg",
            level: 56,
          },
          content:
            "Alguém mais está acompanhando os Jogos Olímpicos? 🏅 As competições de natação estão sendo incríveis! Quais esportes vocês estão curtindo mais?",
          time: "6h",
          likes: 104,
          comments: 27,
          shares: 12,
          image: "https://i.pinimg.com/originals/04/c8/3b/04c83b5895204efb56d8d08d5785dc90.gif",
        },
        {
          id: "8",
          user: {
            name: "Camila Rocha",
            username: "camilarocha",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/green-hair-girl-JVYUhnL8PFB4fyFQsk5zx6PBtEI11a.jpeg",
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
          id: "9",
          user: {
            name: "Fernanda Lima",
            username: "fernandalima",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user5-xd0hvd6VxgdOj5XCM52NfWnZOiSHh6.jpeg",
            level: 25,
          },
          content:
            "Visitei aquele novo café que abriu no centro e adorei! ☕ O ambiente é super aconchegante e os doces são incríveis. Recomendo muito para quem quiser um lugar tranquilo para trabalhar.",
          time: "4h",
          likes: 42,
          comments: 11,
          shares: 3,
        },
 
        {
          id: "11",
          user: {
            name: "Beatriz Campos",
            username: "beatrizcampos",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user2-qWv11NgsFZS50k2Kunp19cIWsZeIRs.jpeg",
            level: 33,
          },
          content:
            "Dica de produtividade: experimentem a técnica Pomodoro! ⏱️ 25 minutos de foco total, 5 de descanso. Tem funcionado muito bem para mim nas últimas semanas. Alguém mais usa?",
          time: "9h",
          likes: 56,
          comments: 14,
          shares: 11,
        },
        {
          id: "12",
          user: {
            name: "Rafael Oliveira",
            username: "rafaeloliveira",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/camera-girl-zzWdTWOqOOxCoKK2XxSAyJdcIWeDbc.jpeg",
            level: 44,
          },
          content:
            "Acabei de voltar de uma viagem incrível para o Japão! 🇯🇵 A cultura, a comida, as pessoas... tudo foi perfeito. Já estou planejando a próxima viagem. Alguém tem dicas de lugares imperdíveis?",
          time: "12h",
          likes: 234,
          comments: 67,
          shares: 23,
          image: "/placeholder.svg?height=400&width=600",
        },
        {
          id: "13",
          user: {
            name: "Amanda Silva",
            username: "amandasilva",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/purple-hair-girl-5UR7mSSW9RhPXXaOQPbIU5nSY1PPzc.jpeg",
            level: 38,
          },
          content:
            "Novo projeto de arte digital finalizado! ✨ Desta vez explorei técnicas de pintura digital com inspiração cyberpunk. O que vocês acham? Feedback é sempre bem-vindo!",
          time: "14h",
          likes: 189,
          comments: 45,
          shares: 31,
          image: "https://i.pinimg.com/1200x/f6/53/3d/f6533d2f0a19f917e5919c2be0236767.jpg",
        },
        {
          id: "14",
          user: {
            name: "Bruno Costa",
            username: "brunocosta",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/red-hair-boy-05fuY1tOxs8pxQzA31IMeIZIhhfi9A.jpeg",
            level: 52,
          },
          content:
            "Dica para desenvolvedores: acabei de descobrir uma biblioteca incrível para animações em React! 🚀 A performance é excelente e a API é super intuitiva. Link nos comentários!",
          time: "16h",
          likes: 156,
          comments: 89,
          shares: 67,
        },
        {
          id: "15",
          user: {
            name: "cesaoooo missias",
            username: "cesaom22",
            avatar: "https://i.pinimg.com/736x/88/e6/ce/88e6cec081f9ee09e7906ce93215387b.jpg",
            level: 2,
          },
          content:
            "acabei de acordar",
          time: "18h",
          likes: 98,
          comments: 34,
          shares: 19,
          image: "https://i.pinimg.com/1200x/5a/51/9a/5a519ab7fbf494265b7ba09de84b05aa.jpg",
        },
        {
          id: "16",
          user: {
            name: "Diego Santos",
            username: "diegosantos",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user6-Wb090hsmMc7XSwurpdOwj7kqOMqHQU.jpeg",
            level: 61,
          },
          content:
            "Reflexão do dia: às vezes precisamos desacelerar para realmente apreciar as pequenas coisas da vida. ☕ Uma xícara de café, um bom livro, a companhia de quem amamos. O que vocês mais valorizam?",
          time: "20h",
          likes: 267,
          comments: 78,
          shares: 45,
        },
        {
          id: "17",
          user: {
            name: "King",
            username: "kingrun",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user5-xd0hvd6VxgdOj5XCM52NfWnZOiSHh6.jpeg",
            level: 33,
          },
          content:
            "Acabei de terminar meu primeiro maratona! 🏃‍♀️ 42km de pura determinação. Não foi fácil, mas a sensação de conquista é indescritível. Próximo objetivo: triathlon!",
          time: "1d",
          likes: 445,
          comments: 123,
          shares: 67,
          image: "https://i.pinimg.com/1200x/df/02/65/df02651de7c46abb056f72400759ce95.jpg",
        },
        {
          id: "19",
          user: {
            name: "Marcos Pereira",
            username: "marcospereira",
            avatar:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/toast-girl-MMqyLyHOsQJgEzusOR0y41IuWDc1Pd.jpeg",
            level: 55,
          },
          content:
            "Finalmente consegui terminar aquele projeto que estava me tirando o sono! 🎉 Foram 3 meses de muito trabalho, mas o resultado ficou incrível. Obrigado a todos que me apoiaram!",
          time: "11h",
          likes: 134,
          comments: 28,
          shares: 15,
        },
        {
          id: "21",
          user: {
            name: "Roberto Lima",
            username: "robertolima",
            avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user3-P3gPRkCRJwUth8GTVPV4Zlk6d83mfZ.jpeg",
            level: 39,
          },
          content:
            "Reflexão da semana: às vezes as melhores oportunidades surgem quando menos esperamos. 💭 Mantenham-se abertos para o novo e não tenham medo de sair da zona de conforto!",
          time: "15h",
          likes: 203,
          comments: 45,
          shares: 67,
        },
      ]

      // Buscar o post pelo ID
      const foundPost = allPosts.find((p) => p.id === postId)

      if (!foundPost) {
        // Se não encontrar o post, redirecionar ou mostrar erro
        router.push("/")
        return
      }

      // Comentários específicos para cada post baseados no ID e número real de comentários
      const getCommentsForPost = (postId: string, totalComments: number) => {
        const allPossibleComments = [
          {
            id: 1,
            user: {
              name: "Maria Santos",
              username: "mariasantos",
              avatar:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pikachu-68KUL5cz0UXZWNgvX312JwkX9BI62r.jpeg",
              level: 47,
            },
            content: "👏",
            time: "1h",
            likes: 8,
          },
        ]

        // Personalizar comentários baseados no conteúdo do post
 
        // Comentários padrão para outros posts
        return allPossibleComments.slice(0, Math.min(totalComments, 8))
      }

      setPost(foundPost)
      setComments(getCommentsForPost(foundPost.id, foundPost.comments))
      setLoading(false)
    }

    fetchPost()
  }, [postId, router])

  const getLevelColor = (level: number) => {
    if (level >= 90) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    if (level >= 70) return "bg-gradient-to-r from-red-500 to-orange-500 text-white"
    if (level >= 50) return "bg-gradient-to-r from-yellow-500 to-amber-500 text-black"
    if (level >= 30) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
    if (level >= 10) return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
  }

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      const newComment = {
        id: comments.length + 1,
        user: {
          name: "Meu Nome",
          username: "meunome",
          avatar:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-53KihlqphLkgA4FU5xkkyJcCkvogK2.jpeg",
          level: 25,
        },
        content: commentText,
        time: "agora",
        likes: 0,
      }
      setComments([newComment, ...comments])
      setCommentText("")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f3]">
        <TopNav />
        <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
          <LeftSidebar className="hidden md:block" />
          <div className="flex-1">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="bg-white rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-80 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
          <RightSidebar className="hidden lg:block" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f7f5f3]">
        <TopNav />
        <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
          <LeftSidebar className="hidden md:block" />
          <div className="flex-1 text-center py-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
            <p className="text-gray-600 mb-6">O post que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => router.push("/")} className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white">
              Voltar ao início
            </Button>
          </div>
          <RightSidebar className="hidden lg:block" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f3]">
      <TopNav />
      <div className="mx-auto flex max-w-7xl gap-6 p-6 pt-24">
        <LeftSidebar className="hidden md:block" />

        <div className="flex-1 space-y-6">
          {/* Botão de voltar */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full px-4 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          {/* Post principal */}
          <Card className="border-0 bg-white shadow-sm rounded-3xl">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold text-lg">
                      {post.user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900 text-lg">{post.user.name}</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevelColor(post.user.level)}`}>
                        Lv.{post.user.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-500">@{post.user.username}</p>
                      <span className="text-gray-300">•</span>
                      <p className="text-gray-500">{post.time}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pb-6">
              <p className="text-gray-800 leading-relaxed text-lg mb-6">{post.content}</p>
              {post.image && (
                <div className="rounded-2xl overflow-hidden">
                  <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-96 object-cover" />
                </div>
              )}
            </CardContent>

            <CardFooter className="border-t border-gray-100 px-6 py-4">
              <div className="flex w-full justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 hover:text-[#1d9bf0] hover:bg-blue-50 rounded-full"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">{post.comments}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full"
                >
                  <Repeat2 className="h-5 w-5" />
                  <span className="font-medium">{post.shares}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                >
                  <Heart className="h-5 w-5" />
                  <span className="font-medium">{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-[#1d9bf0] hover:bg-blue-50 rounded-full"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Seção de comentários */}
          <Card className="border-0 bg-white shadow-sm rounded-3xl" style={{ overflow: "hidden" }}>
            <CardHeader className="pb-4">
              <h3 className="text-lg font-bold text-gray-900">Comentários</h3>
            </CardHeader>

            {/* Área para escrever comentário */}
            <CardContent className="border-b border-gray-100 pb-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-53KihlqphLkgA4FU5xkkyJcCkvogK2.jpeg"
                    alt="Meu avatar"
                  />
                  <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">EU</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                  <Textarea
                    placeholder="Escreva um comentário..."
                    value={commentText}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= 120) {
                        setCommentText(value)
                      }
                    }}
                    className="min-h-16 max-h-32 resize-none border-gray-200 focus:border-[#1d9bf0] focus:ring-[#1d9bf0] rounded-xl w-full"
                    style={{
                      height: "auto",
                      minHeight: "64px",
                      maxHeight: "128px",
                      outline: "none",
                      boxShadow: "none",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                      display: "block",
                      width: "100%",
                      overflow: "hidden",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = "auto"
                      target.style.height = Math.min(target.scrollHeight, 128) + "px"
                    }}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                        <Smile className="h-4 w-4 text-gray-500" />
                      </Button>
                      <span
                        className={`text-xs font-medium ${
                          commentText.length > 100 ? "text-red-500" : "text-gray-400"
                        } ${commentText.length === 0 ? "opacity-0" : "opacity-100"}`}
                      >
                        {120 - commentText.length}
                      </span>
                    </div>
                    <Button
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim() || commentText.length > 120}
                      className="rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold px-6"
                    >
                      Comentar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Lista de comentários */}
            <CardContent className="space-y-6 pt-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                      {comment.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{comment.user.name}</p>
                        <span
                          className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${getLevelColor(comment.user.level)}`}
                        >
                          Lv.{comment.user.level}
                        </span>
                        <span className="text-gray-500 text-sm">@{comment.user.username}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500 text-sm">{comment.time}</span>
                      </div>
                      <p className="text-gray-800 break-words">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full h-8 px-3"
                      >
                        <Heart className="h-3 w-3" />
                        <span className="text-xs font-medium">{comment.likes}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-[#1d9bf0] hover:bg-blue-50 rounded-full h-8 px-3 text-xs"
                      >
                        Responder
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Seja o primeiro a comentar!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <RightSidebar className="hidden lg:block" />
      </div>
    </div>
  )
}
