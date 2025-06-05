"use client"

import React from "react"

import type { ReactElement } from "react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Heart,
  ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share2,
  Smile,
  Video,
  ExternalLink,
  Info,
  Youtube,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Timeline({ className, ...props }: TimelineProps): ReactElement {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou")
  const [showFloatingTabs, setShowFloatingTabs] = useState(false)
  const [showStaticTabsAnimation, setShowStaticTabsAnimation] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [reelsStartIndex, setReelsStartIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right")
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null)
  const [recommendedUsers, setRecommendedUsers] = useState([
    {
      id: 1,
      name: "Sakura Tanaka",
      username: "sakura_chan",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user1-1aZWBVeSS5UnNG6u0zpiqe9mt7hx95.jpeg",
      mutualFriends: 5,
      visible: true,
    },
    {
      id: 2,
      name: "Violet Storm",
      username: "violet_storm",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user2-o8QkpbilZYd7JtTRaL16hZt8Uqz9mj.jpeg",
      mutualFriends: 3,
      visible: true,
    },
    {
      id: 3,
      name: "Himiko Toga",
      username: "himiko_smile",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user3-9ww4jnSm5gbb1Q0MMepQvQHE4JPNw3.jpeg",
      mutualFriends: 2,
      visible: true,
    },
    {
      id: 4,
      name: "Akane Hayashi",
      username: "akane_art",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user4-GVqD9ANozw6TK7YCF4p2gfuUkbqo7o.jpeg",
      mutualFriends: 7,
      visible: true,
    },
    {
      id: 5,
      name: "Luna Kawaii",
      username: "luna_purple",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user5-DK4bBz0GWaDryrZsryvzsbrqMoskfl.jpeg",
      mutualFriends: 4,
      visible: true,
    },
    {
      id: 6,
      name: "Chibi Mochi",
      username: "chibi_mochi",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user6-Ms4BBpPHewJK3sxkYv3okPsAU3jh61.jpeg",
      mutualFriends: 6,
      visible: true,
    },
    {
      id: 7,
      name: "Yuki Sato",
      username: "yuki_dreams",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user1-1aZWBVeSS5UnNG6u0zpiqe9mt7hx95.jpeg",
      mutualFriends: 1,
      visible: true,
    },
    {
      id: 8,
      name: "Rei Ayanami",
      username: "rei_blue",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user2-o8QkpbilZYd7JtTRaL16hZt8Uqz9mj.jpeg",
      mutualFriends: 8,
      visible: true,
    },
  ])
  // Adicionar estes novos estados no início da função Timeline, após os estados existentes:
  const [primaryColor, setPrimaryColor] = useState("#1d9bf0")
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadedPostsCount, setLoadedPostsCount] = useState(1) // Quantas "páginas" de posts foram carregadas
  const lastPostRef = useRef<HTMLDivElement>(null)
  const postAreaRef = useRef<HTMLDivElement>(null)
  const staticTabsRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const reelsContainerRef = useRef<HTMLDivElement>(null)
  const [tabsWidth, setTabsWidth] = useState<number | null>(null)
  const [currentRecommendedIndex, setCurrentRecommendedIndex] = useState(0)

  const maxCharacters = 500
  const isOverLimit = postContent.length > maxCharacters

  // Função para navegar para o post e salvar posição
  const handlePostClick = (postId: number) => {
    // Salvar a posição atual do scroll
    sessionStorage.setItem("timeline_scroll_position", window.scrollY.toString())
    sessionStorage.setItem("timeline_active_tab", activeTab)
    sessionStorage.setItem("timeline_loaded_posts", loadedPostsCount.toString())

    // Navegar para o post
    router.push(`/post/${postId}`)
  }

  // Restaurar posição quando voltar
  useEffect(() => {
    const restorePosition = () => {
      const savedPosition = sessionStorage.getItem("timeline_scroll_position")
      const savedTab = sessionStorage.getItem("timeline_active_tab") as "foryou" | "following"
      const savedLoadedPosts = sessionStorage.getItem("timeline_loaded_posts")

      if (savedTab && savedTab !== activeTab) {
        setActiveTab(savedTab)
      }

      if (savedLoadedPosts) {
        setLoadedPostsCount(Number.parseInt(savedLoadedPosts))
      }

      if (savedPosition) {
        // Aguardar um pouco para garantir que o conteúdo foi renderizado
        setTimeout(() => {
          window.scrollTo({
            top: Number.parseInt(savedPosition),
            behavior: "smooth",
          })
          // Limpar os dados salvos após restaurar
          sessionStorage.removeItem("timeline_scroll_position")
          sessionStorage.removeItem("timeline_active_tab")
          sessionStorage.removeItem("timeline_loaded_posts")
        }, 100)
      }
    }

    // Verificar se estamos voltando de uma página de post
    if (sessionStorage.getItem("timeline_scroll_position")) {
      restorePosition()
    }
  }, [])

  useEffect(() => {
    const updateColor = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue("--primary-color") || "#1d9bf0"
      setPrimaryColor(color)
    }

    updateColor()

    const observer = new MutationObserver(updateColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Get the width of the static tabs for the floating tabs
    const updateTabsWidth = () => {
      if (staticTabsRef.current) {
        setTabsWidth(staticTabsRef.current.offsetWidth)
      }
    }

    // Initial measurement
    updateTabsWidth()

    const handleScroll = () => {
      if (postAreaRef.current) {
        const rect = postAreaRef.current.getBoundingClientRect()
        const shouldShowFloating = rect.bottom < 100

        // If floating tabs are disappearing (scrolling up), trigger static tabs animation
        if (showFloatingTabs && !shouldShowFloating) {
          setShowStaticTabsAnimation(true)
          // Remove animation class after animation completes
          setTimeout(() => setShowStaticTabsAnimation(false), 400)
        }

        if (showFloatingTabs !== shouldShowFloating) {
          setShowFloatingTabs(shouldShowFloating)
        }
      }
    }

    const handleResize = () => {
      updateTabsWidth()
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    // Use ResizeObserver for more accurate measurements
    const resizeObserver = new ResizeObserver(() => {
      updateTabsWidth()
    })

    if (staticTabsRef.current) {
      resizeObserver.observe(staticTabsRef.current)
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      resizeObserver.disconnect()
    }
  }, [showFloatingTabs])

  const handleTabChange = (tab: "foryou" | "following", scrollToTop = false) => {
    setActiveTab(tab)

    // Scroll to top if requested (from floating menu)
    if (scrollToTop && timelineRef.current) {
      // Get the position of the timeline element
      const timelinePosition = timelineRef.current.getBoundingClientRect().top + window.scrollY - 80

      // Scroll to that position smoothly
      window.scrollTo({
        top: timelinePosition,
        behavior: "smooth",
      })
    }
  }

  // Adicionar mais posts para a aba "For You"
  const allForYouPosts = [
    // Posts originais (página 1)
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
      id: 999,
      isSponsored: true,
      user: {
        name: "AnimeWorld",
        username: "animeworld_official",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime-profile-purple-0VWATRjaTziL6RSx9RF6SsdKJBjwRG.jpeg",
        verified: true,
      },
      content:
        "✨ Descubra o mundo dos animes como nunca antes! ✨\n\nApresentando nossa nova coleção de verão com designs exclusivos inspirados nos seus personagens favoritos. Peças limitadas com 30% de desconto na pré-venda!\n\nUse o código BILIBILI15 para ganhar 15% extra no seu primeiro pedido. Frete grátis para todo o país!",
      time: "Patrocinado",
      likes: 1243,
      comments: 328,
      shares: 156,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime-girl-mouse-QbBjHtDiSEgtx8JyiUlV0domwduqBc.jpeg",
      cta: "Comprar Agora",
      url: "https://animeworld.com/summer-collection",
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
    // Posts adicionais (página 2)
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
    {
      id: 14,
      user: {
        name: "Bruno Costa",
        username: "brunocosta",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/red-hair-boy-QDciatAIAP8Z9IPqcaf6e6yBptyFkX.jpeg",
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
      id: 16,
      user: {
        name: "Diego Santos",
        username: "diegosantos",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user6-Ms4BBpPHewJK3sxkYv3okPsAU3jh61.jpeg",
        level: 61,
      },
      content:
        "Reflexão do dia: às vezes precisamos desacelerar para realmente apreciar as pequenas coisas da vida. ☕ Uma xícara de café, um bom livro, a companhia de quem amamos. O que vocês mais valorizam?",
      time: "20h",
      likes: 267,
      comments: 78,
      shares: 45,
    },
    // Posts adicionais (página 3)
    {
      id: 17,
      user: {
        name: "King",
        username: "kingrun",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user5-DK4bBz0GWaDryrZsryvzsbrqMoskfl.jpeg",
        level: 33,
      },
      content:
        "Acabei de terminar meu primeiro maratona! 🏃‍♀️ 42km de pura determinação. Não foi fácil, mas a sensação de conquista é indescritível. Próximo objetivo: triathlon!",
      time: "1d",
      likes: 445,
      comments: 123,
      shares: 67,
      image: "https://i.pinimg.com/736x/09/70/08/097008f7be427688c1589d7fb4d8e1e5.jpg",
    },
    {
      id: 18,
      user: {
        name: "Lucas Ferreira",
        username: "lucasferreira",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user4-GVqD9ANozw6TK7YCF4p2gfuUkbqo7o.jpeg",
        level: 47,
      },
      content:
        "Novo setup de trabalho finalizado! 💻 Depois de meses planejando, finalmente consegui montar o home office dos sonhos. Produtividade nas alturas! Quem mais trabalha de casa?",
      time: "1d",
      likes: 178,
      comments: 56,
      shares: 34,
      image: "https://i.pinimg.com/1200x/de/5a/0a/de5a0a7bb19d0092e921d37eaafbfc28.jpg",
    },
  ]

  // Adicionar mais posts para a aba "Following"
  const allFollowingPosts = [
    // Posts originais (página 1)
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
      id: 998,
      isSponsored: true,
      user: {
        name: "GameVerse",
        username: "gameverse_official",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime-profile-purple-0VWATRjaTziL6RSx9RF6SsdKJBjwRG.jpeg",
        verified: true,
      },
      content:
        "🎮 GAMERS, PREPAREM-SE! 🎮\n\nO maior evento de games do ano está chegando! GameCon 2025 com lançamentos exclusivos, torneios com premiação de R$100.000 e encontros com seus criadores de conteúdo favoritos!\n\nIngressos limitados com 25% de desconto na pré-venda. Garanta já o seu e não fique de fora dessa experiência épica!",
      time: "Patrocinado",
      likes: 3567,
      comments: 842,
      shares: 721,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime-girl-mouse-QbBjHtDiSEgtx8JyiUlV0domwduqBc.jpeg",
      cta: "Garantir Ingresso",
      url: "https://gamecon2025.com/tickets",
    },
 
    {
      id: 9,
      user: {
        name: "Fernanda Lima",
        username: "fernandalima",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user5-DK4bBz0GWaDryrZsryvzsbrqMoskfl.jpeg",
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
      id: 11,
      user: {
        name: "Beatriz Campos",
        username: "beatrizcampos",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user2-o8QkpbilZYd7JtTRaL16hZt8Uqz9mj.jpeg",
        level: 33,
      },
      content:
        "Dica de produtividade: experimentem a técnica Pomodoro! ⏱️ 25 minutos de foco total, 5 de descanso. Tem funcionado muito bem para mim nas últimas semanas. Alguém mais usa?",
      time: "9h",
      likes: 56,
      comments: 14,
      shares: 11,
    },
    // Posts adicionais (página 2)
    {
      id: 19,
      user: {
        name: "Marcos Pereira",
        username: "marcospereira",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/toast-girl-krG3O4X5C0UopnIKohgHeGqxEwXrFj.jpeg",
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
      id: 20,
      user: {
        name: "Juliana Rocha",
        username: "julianarocha",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user2-o8QkpbilZYd7JtTRaL16hZt8Uqz9mj.jpeg",
        level: 41,
      },
      content:
        "Descobri um restaurante japonês incrível! 🍣 A qualidade dos ingredientes é excepcional e o atendimento é impecável. Já virou meu lugar favorito para jantar. Alguém conhece?",
      time: "13h",
      likes: 87,
      comments: 19,
      shares: 8,
      image: "https://i.pinimg.com/736x/e6/50/de/e650dee5fcf29a28e9aea5b0ea26d5eb.jpg",
    },
    {
      id: 21,
      user: {
        name: "Roberto Lima",
        username: "robertolima",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user3-9ww4jnSm5gbb1Q0MMepQvQHE4JPNw3.jpeg",
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

  // Substituir a lógica dos posts atuais por:
  const postsPerPage = 7 // Número de posts por "página"
  const currentAllPosts = activeTab === "foryou" ? allForYouPosts : allFollowingPosts
  const currentPosts = currentAllPosts.slice(0, postsPerPage * loadedPostsCount)

  const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxCharacters) {
      setPostContent(value)
    }
  }

  const remainingCharacters = maxCharacters - postContent.length
  const isNearLimit = remainingCharacters <= 50

  // Reels com os vídeos do YouTube que você passou
  const allReels = [
    {
      id: 1,
      title: "Amazing Short Video 🔥",
      thumbnail: `https://img.youtube.com/vi/5ft5dvgo9KI/maxresdefault.jpg`,
      views: "1.2M",
      videoId: "5ft5dvgo9KI",
      author: {
        name: "TechGuru",
        username: "techguru",
        avatar: "TG",
      },
    },
    {
      id: 2,
      title: "Incredible Moments ✨",
      thumbnail: `https://img.youtube.com/vi/q6POuFRPGfk/maxresdefault.jpg`,
      views: "856K",
      videoId: "q6POuFRPGfk",
      author: {
        name: "CreativeStudio",
        username: "creativestudio",
        avatar: "CS",
      },
    },
    {
      id: 3,
      title: "Mind Blowing Content 🤯",
      thumbnail: `https://img.youtube.com/vi/Fdp5N_Z9DoA/maxresdefault.jpg`,
      views: "2.1M",
      videoId: "Fdp5N_Z9DoA",
      author: {
        name: "ViralMaker",
        username: "viralmaker",
        avatar: "VM",
      },
    },
    {
      id: 4,
      title: "Epic Short Video 🚀",
      thumbnail: `https://img.youtube.com/vi/DyZDg0O37JI/maxresdefault.jpg`,
      views: "743K",
      videoId: "DyZDg0O37JI",
      author: {
        name: "ContentKing",
        username: "contentking",
        avatar: "CK",
      },
    },
    {
      id: 5,
      title: "Cyberpunk Streamer 🎮",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime3-0EusYceZHUzZix4rThZg80sGrYEnWx.jpeg",
      views: "12K",
      author: {
        name: "CyberGirl",
        username: "cybergirl",
        avatar: "CG",
      },
    },
    {
      id: 6,
      title: "Keep Out! 💥",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime2-MFT2xjvVQwLjYUQvxL06bPn1CJYRdL.jpeg",
      views: "8.5K",
      author: {
        name: "PinkHacker",
        username: "pinkhacker",
        avatar: "PH",
      },
    },
  ]

  // Função para abrir o vídeo do YouTube
  const openYouTubeVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank")
  }

  const handleNextReels = () => {
    if (reelsStartIndex + 3 < allReels.length && !isTransitioning) {
      setIsTransitioning(true)
      setReelsStartIndex(reelsStartIndex + 1)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }

  const handlePrevReels = () => {
    if (reelsStartIndex > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setReelsStartIndex(reelsStartIndex - 1)
      setTimeout(() => setIsTransitioning(false), 300)
    }
  }

  // Sempre mostrar 3 reels
  const currentReels = allReels.slice(reelsStartIndex, reelsStartIndex + 3)

  // Verificar se pode navegar
  const canGoNext = reelsStartIndex + 3 < allReels.length
  const canGoPrev = reelsStartIndex > 0

  // Verificar se estamos nos últimos 3 vídeos (para inverter a ordem)
  const isLastSet = reelsStartIndex + 3 >= allReels.length

  // Função para remover um usuário recomendado
  const removeRecommendedUser = (userId: number) => {
    setRecommendedUsers(recommendedUsers.map((user) => (user.id === userId ? { ...user, visible: false } : user)))
  }

  // Filtrar apenas usuários visíveis
  const visibleRecommendedUsers = recommendedUsers.filter((user) => user.visible)

  const refreshRecommendedUsers = () => {
    const totalUsers = recommendedUsers.filter((user) => user.visible).length
    if (totalUsers > 3) {
      setCurrentRecommendedIndex((prev) => {
        const nextIndex = prev + 3
        return nextIndex >= totalUsers ? 0 : nextIndex
      })
    }
  }

  const getLevelColor = (level: number) => {
    if (level >= 90) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
    if (level >= 70) return "bg-gradient-to-r from-red-500 to-orange-500 text-white"
    if (level >= 50) return "bg-gradient-to-r from-yellow-500 to-amber-500 text-black"
    if (level >= 30) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
    if (level >= 10) return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
    return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
  }

  // Adicionar useEffect para Intersection Observer após os useEffects existentes:
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastPost = entries[0]
        if (lastPost.isIntersecting && !isLoadingMore && currentPosts.length < currentAllPosts.length) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 },
    )

    if (lastPostRef.current) {
      observer.observe(lastPostRef.current)
    }

    return () => {
      if (lastPostRef.current) {
        observer.unobserve(lastPostRef.current)
      }
    }
  }, [currentPosts.length, currentAllPosts.length, isLoadingMore])

  // Adicionar função para carregar mais posts:
  const loadMorePosts = async () => {
    setIsLoadingMore(true)

    // Simular delay de carregamento mais rápido
    await new Promise((resolve) => setTimeout(resolve, 800))

    setLoadedPostsCount((prev) => prev + 1)
    setIsLoadingMore(false)
  }

  // Resetar posts quando trocar de aba - adicionar este useEffect:
  useEffect(() => {
    setLoadedPostsCount(1)
  }, [activeTab])

  return (
    <div ref={timelineRef} className={cn("space-y-6 bg-white-50 dark:bg-gray-900", className)} {...props}>
      {/* Static Tab Navigation */} 
      <div ref={staticTabsRef}>
        <Card
          className={cn(
            "border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-3xl transition-all duration-400",
            showStaticTabsAnimation && "animate-pulse",
          )}
        >
          <div className="flex">
            
            <button
              onClick={() => handleTabChange("foryou")}
              className={cn(
                "flex-1 py-4 px-6 text-center font-semibold transition-all relative",
                activeTab === "foryou"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              For You
              
              {activeTab === "foryou" && (
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1d9bf0] rounded-full" />
              )}
            </button>
            <button
              onClick={() => handleTabChange("following")}
              className={cn(
                "flex-1 py-4 px-6 text-center font-semibold transition-all relative",
                activeTab === "following"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
              )}
            >
              Following
              {activeTab === "following" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1d9bf0] rounded-full" />
              )}
            </button>
          </div>
        </Card>
      </div>

      {/* Create Post Card - Sempre mostrando tudo */}
      <div ref={postAreaRef}>
        <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
          <CardHeader className="pb-2">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-79VNDGOHYgVw2BgTQC3Ax3lPuffBwA.jpeg"
                  alt="Avatar"
                />
                <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">EU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="O que você está pensando?"
                  value={postContent}
                  onChange={handlePostChange}
                  className="min-h-16 resize-none border-0 p-0 text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white"
                  style={{
                    height: "auto",
                    minHeight: "64px",
                    maxHeight: "200px",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = "auto"
                    target.style.height = target.scrollHeight + "px"
                  }}
                />
                {/* <div className="flex justify-end mt-1">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isNearLimit ? "text-red-500" : "text-gray-400 dark:text-gray-500",
                      postContent.length === 0 ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {remainingCharacters}
                  </span>
                </div> */}
              </div>
            </div>
          </CardHeader>

          {/* Sempre mostrar os botões */}
          <CardFooter className="flex justify-between border-t border-gray-100 dark:border-gray-700 px-6 py-3">
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
                <Video className="h-4 w-4 text-gray-500 dark:text-gray-400" />
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
              className="rounded-full text-white font-semibold px-6"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${primaryColor}dd`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor
              }}
              disabled={postContent.trim() === "" || isOverLimit}
            >
              Publicar
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Posts */}
      {currentPosts.map((post, index) => (
        <React.Fragment key={post.id}>
          {post.isSponsored ? (
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-md rounded-3xl overflow-hidden relative">
              {/* Indicador de anúncio */}
              <div
                className="absolute top-0 right-0 left-0 h-1"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}80, ${primaryColor}cc)`,
                }}
              />

              <CardHeader className="pb-3 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 ring-2 ring-[#1d9bf0]/20">
                      <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#1d9bf0] to-purple-500 text-white font-semibold">
                        {post.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 dark:text-white">{post.user.name}</p>
                        {post.user.verified && (
                          <div className="bg-[#1d9bf0] rounded-full p-0.5 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="white"
                              className="w-3 h-3"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <p className="text-gray-500 dark:text-gray-400">@{post.user.username}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge
                          variant="outline"
                          className="text-xs font-medium bg-[#1d9bf0]/5 text-[#1d9bf0] border-[#1d9bf0]/20 px-2 py-0 h-5 rounded-full"
                        >
                          Patrocinado
                        </Badge>
                        <button className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 flex items-center gap-0.5">
                          <Info className="w-3 h-3" />
                        </button>
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

              <CardContent className="pb-4 space-y-4">
                <div className="whitespace-pre-line text-gray-800 dark:text-gray-200 leading-relaxed">
                  {post.content}
                </div>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                    <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-80 object-cover" />
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    className="w-full text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}dd, ${primaryColor}bb)`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`
                    }}
                  >
                    {post.cta}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
                <div className="flex w-full justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-500 dark:text-gray-400 hover:text-[#1d9bf0] hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full"
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
                    className="text-gray-500 dark:text-gray-400 hover:text-[#1d9bf0] hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold">
                        {post.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 dark:text-white">{post.user.name}</p>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevelColor(post.user.level)}`}
                        >
                          Lv {post.user.level}
                        </span>
                        
                        <p className="text-gray-500 pl-5 dark:text-gray-400">{post.time}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">@{post.user.username}</p> 
                        
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
              <div onClick={() => handlePostClick(post.id)} className="cursor-pointer">
                <CardContent className="pb-4">
                  <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">{post.content}</p>
                  {post.image && (
                    <div className="rounded-2xl overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post image"
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </div>
              <CardFooter className="border-t border-gray-100 dark:border-gray-700 px-6 py-4">
                <div className="flex w-full justify-between">
                  <div onClick={() => handlePostClick(post.id)} className="flex-1 cursor-pointer">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-500 dark:text-gray-400 hover:text-[#1d9bf0] hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{post.comments}</span>
                    </Button>
                  </div>
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
                    className="text-gray-500 dark:text-gray-400 hover:text-[#1d9bf0] hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Reels após o segundo post */}
          {index === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#1d9bf0]" />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Reels</h3>
                </div>
                <Button
                  variant="ghost"
                  className="text-[#1d9bf0] hover:bg-blue-50 dark:hover:bg-blue-950 font-medium text-sm h-8 px-4"
                >
                  Criar
                </Button>
              </div>
              <div className="relative">
                <div className="flex p-4 overflow-hidden" style={{ width: "100%" }}>
                  {/* Container com largura fixa para os reels */}
                  <div ref={reelsContainerRef} className="flex gap-2 w-full">
                    {!isLastSet ? (
                      // Layout normal: 1º e 2º completos, 3º cortado
                      <>
                        {/* Primeiro reel - 45% */}
                        <div
                          className="cursor-pointer group"
                          style={{ width: "45%" }}
                          onClick={() => currentReels[0]?.videoId && openYouTubeVideo(currentReels[0].videoId)}
                          onMouseEnter={() => setHoveredVideoId(currentReels[0]?.videoId || null)}
                          onMouseLeave={() => setHoveredVideoId(null)}
                        >
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ height: "446.7px" }}
                          >
                            {/* Vídeo ou imagem */}
                            {currentReels[0]?.videoId && hoveredVideoId === currentReels[0].videoId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${currentReels[0].videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentReels[0].videoId}&modestbranding=1&rel=0&showinfo=0`}
                                className="w-full h-full object-cover"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{ border: "none" }}
                              />
                            ) : (
                              <img
                                src={currentReels[0]?.thumbnail || "/placeholder.svg"}
                                alt={currentReels[0]?.title}
                                className="w-full h-full object-cover"
                              />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 transition-all duration-300" />

                            {/* Avatar e username do autor */}
                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                              <Avatar className="w-6 h-6 border-2 border-white/80 shadow-lg">
                                <AvatarImage
                                  src={`/placeholder.svg?height=24&width=24&text=${currentReels[0]?.author.avatar}`}
                                  alt={currentReels[0]?.author.name}
                                />
                                <AvatarFallback className="bg-[#1d9bf0] text-white text-xs font-semibold">
                                  {currentReels[0]?.author.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white text-xs font-medium">
                                @{currentReels[0]?.author.username}
                              </span>
                            </div>

                            {/* YouTube icon if it's a YouTube video */}
                            {currentReels[0]?.videoId && (
                              <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1">
                                <Youtube className="h-4 w-4" />
                              </div>
                            )}

                            {/* Play button - only show when not hovering */}
                            {!(currentReels[0]?.videoId && hoveredVideoId === currentReels[0].videoId) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                  <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                                </div>
                              </div>
                            )}

                            {/* Views badge */}
                            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm transition-all duration-300 group-hover:bg-[#1d9bf0]/90">
                              {currentReels[0]?.views}
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                              <p className="drop-shadow-lg line-clamp-2 transition-all duration-300 group-hover:text-blue-200">
                                {currentReels[0]?.title}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Segundo reel - 45% */}
                        <div
                          className="cursor-pointer group"
                          style={{ width: "45%" }}
                          onClick={() => currentReels[1]?.videoId && openYouTubeVideo(currentReels[1].videoId)}
                          onMouseEnter={() => setHoveredVideoId(currentReels[1]?.videoId || null)}
                          onMouseLeave={() => setHoveredVideoId(null)}
                        >
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ height: "446.7px" }}
                          >
                            {/* Vídeo ou imagem */}
                            {currentReels[1]?.videoId && hoveredVideoId === currentReels[1].videoId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${currentReels[1].videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentReels[1].videoId}&modestbranding=1&rel=0&showinfo=0`}
                                className="w-full h-full object-cover"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{ border: "none" }}
                              />
                            ) : (
                              <img
                                src={currentReels[1]?.thumbnail || "/placeholder.svg"}
                                alt={currentReels[1]?.title}
                                className="w-full h-full object-cover"
                              />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 transition-all duration-300" />

                            {/* Avatar e username do autor */}
                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                              <Avatar className="w-6 h-6 border-2 border-white/80 shadow-lg">
                                <AvatarImage
                                  src={`/placeholder.svg?height=24&width=24&text=${currentReels[1]?.author.avatar}`}
                                  alt={currentReels[1]?.author.name}
                                />
                                <AvatarFallback className="bg-[#1d9bf0] text-white text-xs font-semibold">
                                  {currentReels[1]?.author.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white text-xs font-medium">
                                @{currentReels[1]?.author.username}
                              </span>
                            </div>

                            {/* YouTube icon if it's a YouTube video */}
                            {currentReels[1]?.videoId && (
                              <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1">
                                <Youtube className="h-4 w-4" />
                              </div>
                            )}

                            {/* Play button - only show when not hovering */}
                            {!(currentReels[1]?.videoId && hoveredVideoId === currentReels[1].videoId) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                  <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                                </div>
                              </div>
                            )}

                            {/* Views badge */}
                            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm transition-all duration-300 group-hover:bg-[#1d9bf0]/90">
                              {currentReels[1]?.views}
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                              <p className="drop-shadow-lg line-clamp-2 transition-all duration-300 group-hover:text-blue-200">
                                {currentReels[1]?.title}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Terceiro reel - 10% (cortado) */}
                        {currentReels[2] && (
                          <div
                            className="cursor-pointer group overflow-hidden"
                            style={{ width: "10%" }}
                            onClick={() => handleNextReels()}
                          >
                            <div
                              className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group-hover:shadow-lg"
                              style={{ height: "446.7px" }}
                            >
                              <img
                                src={currentReels[2]?.thumbnail || "/placeholder.svg"}
                                alt={currentReels[2]?.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div className="absolute inset-0 bg-black/20" />

                              {/* Indicador de "próximo" */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-gray-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      // Layout invertido para os últimos 3: 3º cortado, 1º e 2º completos
                      <>
                        {/* Primeiro reel cortado - 10% */}
                        {currentReels[0] && (
                          <div
                            className="cursor-pointer group overflow-hidden"
                            style={{ width: "10%" }}
                            onClick={() => handlePrevReels()}
                          >
                            <div
                              className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group-hover:shadow-lg"
                              style={{ height: "446.7px" }}
                            >
                              <img
                                src={currentReels[0]?.thumbnail || "/placeholder.svg"}
                                alt={currentReels[0]?.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <div className="absolute inset-0 bg-black/20" />

                              {/* Indicador de "anterior" */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-gray-800"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 19l-7-7 7-7"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Segundo reel - 45% */}
                        <div
                          className="cursor-pointer group"
                          style={{ width: "45%" }}
                          onClick={() => currentReels[1]?.videoId && openYouTubeVideo(currentReels[1].videoId)}
                          onMouseEnter={() => setHoveredVideoId(currentReels[1]?.videoId || null)}
                          onMouseLeave={() => setHoveredVideoId(null)}
                        >
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ height: "446.7px" }}
                          >
                            {/* Vídeo ou imagem */}
                            {currentReels[1]?.videoId && hoveredVideoId === currentReels[1].videoId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${currentReels[1].videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentReels[1].videoId}&modestbranding=1&rel=0&showinfo=0`}
                                className="w-full h-full object-cover"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{ border: "none" }}
                              />
                            ) : (
                              <img
                                src={currentReels[1]?.thumbnail || "/placeholder.svg"}
                                alt={currentReels[1]?.title}
                                className="w-full h-full object-cover"
                              />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 transition-all duration-300" />

                            {/* Avatar e username do autor */}
                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                              <Avatar className="w-6 h-6 border-2 border-white/80 shadow-lg">
                                <AvatarImage
                                  src={`/placeholder.svg?height=24&width=24&text=${currentReels[1]?.author.avatar}`}
                                  alt={currentReels[1]?.author.name}
                                />
                                <AvatarFallback className="bg-[#1d9bf0] text-white text-xs font-semibold">
                                  {currentReels[1]?.author.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white text-xs font-medium">
                                @{currentReels[1]?.author.username}
                              </span>
                            </div>

                            {/* YouTube icon if it's a YouTube video */}
                            {currentReels[1]?.videoId && (
                              <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1">
                                <Youtube className="h-4 w-4" />
                              </div>
                            )}

                            {/* Play button - only show when not hovering */}
                            {!(currentReels[1]?.videoId && hoveredVideoId === currentReels[1].videoId) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                  <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                                </div>
                              </div>
                            )}

                            {/* Views badge */}
                            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm transition-all duration-300 group-hover:bg-[#1d9bf0]/90">
                              {currentReels[1]?.views}
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                              <p className="drop-shadow-lg line-clamp-2 transition-all duration-300 group-hover:text-blue-200">
                                {currentReels[1]?.title}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Terceiro reel - 45% */}
                        <div
                          className="cursor-pointer group"
                          style={{ width: "45%" }}
                          onClick={() => currentReels[2]?.videoId && openYouTubeVideo(currentReels[2].videoId)}
                          onMouseEnter={() => setHoveredVideoId(currentReels[2]?.videoId || null)}
                          onMouseLeave={() => setHoveredVideoId(null)}
                        >
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ height: "446.7px" }}
                          >
                            {/* Vídeo ou imagem */}
                            {currentReels[2]?.videoId && hoveredVideoId === currentReels[2].videoId ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${currentReels[2].videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentReels[2].videoId}&modestbranding=1&rel=0&showinfo=0`}
                                className="w-full h-full object-cover"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{ border: "none" }}
                              />
                            ) : (
                              <img
                                src={currentReels[2]?.thumbnail || "/placeholder.svg"}
                                alt={currentReels[2]?.title}
                                className="w-full h-full object-cover"
                              />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 transition-all duration-300" />

                            {/* Avatar e username do autor */}
                            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                              <Avatar className="w-6 h-6 border-2 border-white/80 shadow-lg">
                                <AvatarImage
                                  src={`/placeholder.svg?height=24&width=24&text=${currentReels[2]?.author.avatar}`}
                                  alt={currentReels[2]?.author.name}
                                />
                                <AvatarFallback className="bg-[#1d9bf0] text-white text-xs font-semibold">
                                  {currentReels[2]?.author.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-white text-xs font-medium">
                                @{currentReels[2]?.author.username}
                              </span>
                            </div>

                            {/* YouTube icon if it's a YouTube video */}
                            {currentReels[2]?.videoId && (
                              <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1">
                                <Youtube className="h-4 w-4" />
                              </div>
                            )}

                            {/* Play button - only show when not hovering */}
                            {!(currentReels[2]?.videoId && hoveredVideoId === currentReels[2].videoId) && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                  <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                                </div>
                              </div>
                            )}

                            {/* Views badge */}
                            <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm transition-all duration-300 group-hover:bg-[#1d9bf0]/90">
                              {currentReels[2]?.views}
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                              <p className="drop-shadow-lg line-clamp-2 transition-all duration-300 group-hover:text-blue-200">
                                {currentReels[2]?.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Users após o quarto post */}
          {index === 3 && visibleRecommendedUsers.length > 0 && (
            <div className="bg-card text-card-foreground border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-900/30 shadow-sm rounded-3xl overflow-hidden">
              <div className="flex flex-col space-y-1.5 p-6 pb-4 bg-gradient-to-r from-blue-50/50 to-purple-50/30 dark:from-blue-950/50 dark:to-purple-950/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pessoas que você pode conhecer</h3>
                  </div>
                  <button
                    onClick={refreshRecommendedUsers}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-9 w-9 rounded-full hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-md transition-all duration-200 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-ellipsis h-5 w-5 text-gray-500 dark:text-gray-400 transition-colors duration-200 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 pt-0 space-y-2 px-6 pb-6">
                {visibleRecommendedUsers.slice(currentRecommendedIndex, currentRecommendedIndex + 3).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 dark:hover:from-blue-950/50 dark:hover:to-purple-950/30 rounded-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-blue-100/50 dark:hover:border-blue-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <span className="relative flex shrink-0 overflow-hidden rounded-full h-14 w-14 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <img
                            className="aspect-square h-full w-full"
                            alt={user.name}
                            src={user.avatar || "/placeholder.svg"}
                          />
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">@{user.username}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-white-500 rounded-full"></div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {user.mutualFriends} amigos em comum
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-white font-semibold px-6 py-2 h-9 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}dd, ${primaryColor}bb)`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`
                        }}
                        onClick={() => removeRecommendedUser(user.id)}
                      >
                        Seguir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Loading indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d9bf0]"></div>
        </div>
      )}

      {/* Mensagem de fim do feed */}
      {!isLoadingMore && currentPosts.length >= currentAllPosts.length && (
        <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm rounded-3xl">
          <CardContent className="py-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Você chegou ao fim do feed!</h3>
                <p className="text-gray-600 dark:text-gray-400">Siga mais pessoas para ver mais conteúdo!</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="text-white font-semibold px-6 py-2 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${primaryColor}dd`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = primaryColor
                  }}
                >
                  Encontrar Pessoas
                </Button>
                <Button
                  variant="outline"
                  className="font-semibold px-6 py-2 rounded-full border-gray-300 dark:border-gray-600 hover:bg-white-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    if (activeTab !== "foryou") {
                      handleTabChange("foryou", true)
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  }}
                >
                  Ver For You
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Elemento para detectar quando chegou ao final */}
      <div ref={lastPostRef} className="h-4" />

      {/* Floating Tab Navigation */}
      {showFloatingTabs && (
        <div className="fixed top-[3rem] left-1/2 transform -translate-x-1/2 z-50 slide-in-from-top">
          <div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-b-3xl border border-white/20 dark:border-gray-700/20 ring-1 ring-black/5 dark:ring-white/5"
               
            style={{ width: tabsWidth ? `${tabsWidth}px` : "auto" }}
          >
            <div className="flex">
              <button
                onClick={() => handleTabChange("foryou", true)}
                className={cn(
                  "flex-1 py-4 px-6 text-center font-semibold transition-all relative",
                  activeTab === "foryou"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                )}
              >
                For You
                {activeTab === "foryou" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1d9bf0] rounded-full" />
                )}
              </button>
              <button
                onClick={() => handleTabChange("following", true)}
                className={cn(
                  "flex-1 py-4 px-6 text-center font-semibold transition-all relative",
                  activeTab === "following"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
                )}
              >
                Following
                {activeTab === "following" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#1d9bf0] rounded-full" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
