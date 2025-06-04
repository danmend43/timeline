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
  ChevronRight,
  ChevronLeft,
  Video,
  ExternalLink,
  Info,
  UserPlus,
  Sparkles,
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
  const [recommendedUsers, setRecommendedUsers] = useState([
    {
      id: 1,
      name: "Sakura Tanaka",
      username: "sakura_chan",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user1-6Rxws8120XoRVlcur6sqsdRladgxm2.jpeg",
      mutualFriends: 5,
      visible: true,
    },
    {
      id: 2,
      name: "Violet Storm",
      username: "violet_storm",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user2-qWv11NgsFZS50k2Kunp19cIWsZeIRs.jpeg",
      mutualFriends: 3,
      visible: true,
    },
    {
      id: 3,
      name: "Himiko Toga",
      username: "himiko_smile",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user3-P3gPRkCRJwUth8GTVPV4Zlk6d83mfZ.jpeg",
      mutualFriends: 2,
      visible: true,
    },
    {
      id: 4,
      name: "Akane Hayashi",
      username: "akane_art",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user4-oEaMhAjkhQXIKvKErl2GVv0h1l3yex.jpeg",
      mutualFriends: 7,
      visible: true,
    },
    {
      id: 5,
      name: "Luna Kawaii",
      username: "luna_purple",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user5-xd0hvd6VxgdOj5XCM52NfWnZOiSHh6.jpeg",
      mutualFriends: 4,
      visible: true,
    },
    {
      id: 6,
      name: "Chibi Mochi",
      username: "chibi_mochi",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user6-Wb090hsmMc7XSwurpdOwj7kqOMqHQU.jpeg",
      mutualFriends: 6,
      visible: true,
    },
    {
      id: 7,
      name: "Yuki Sato",
      username: "yuki_dreams",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user1-6Rxws8120XoRVlcur6sqsdRladgxm2.jpeg",
      mutualFriends: 1,
      visible: true,
    },
    {
      id: 8,
      name: "Rei Ayanami",
      username: "rei_blue",
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user2-qWv11NgsFZS50k2Kunp19cIWsZeIRs.jpeg",
      mutualFriends: 8,
      visible: true,
    },
  ])
  // Adicionar estes novos estados no início da função Timeline, após os estados existentes:
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

        setShowFloatingTabs(shouldShowFloating)
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
        name: "cesaaoo missias",
        username: "crs22",
        avatar:
          "https://i.pinimg.com/736x/88/e6/ce/88e6cec081f9ee09e7906ce93215387b.jpg",
        level: -5,
      },
      content:
        "3 dias dormindo, acordei agora.",
      time: "2h",
      likes: 47,
      comments: 12,
      shares: 8,
      image: "https://i.pinimg.com/originals/5a/51/9a/5a519ab7fbf494265b7ba09de84b05aa.gif",
    },
    {
      id: 999,
      isSponsored: true,
      user: {
        name: "AnimeWorld",
        username: "animeworld_official",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime-profile-purple-8Ol0RxFg4Fc5lF6kbtgahq4XVWL70i.jpeg",
        verified: true,
      },
      content:
        "✨ Descubra o mundo dos animes como nunca antes! ✨\n\nApresentando nossa nova coleção de verão com designs exclusivos inspirados nos seus personagens favoritos. Peças limitadas com 30% de desconto na pré-venda!\n\nUse o código BILIBILI15 para ganhar 15% extra no seu primeiro pedido. Frete grátis para todo o país!",
      time: "Patrocinado",
      likes: 1243,
      comments: 328,
      shares: 156,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime-girl-mouse-LEmDKCG1P7JuhjQPr99G80fKG0JUkH.jpeg",
      cta: "Comprar Agora",
      url: "https://animeworld.com/summer-collection",
    },
    {
      id: 2,
      user: {
        name: "Maria Santos",
        username: "mariasantos",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pikachu-68KUL5cz0UXZWNgvX312JwkX9BI62r.jpeg",
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
      id: 6,
      user: {
        name: "Luiza Mendonça",
        username: "luizamendonca",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meowth-sunglasses-ic1bFAdbLemetHHuJ0TiMwZanKVmnl.jpeg",
        level: 19,
      },
      content:
        "Finalmente terminei de assistir aquela série que todo mundo estava comentando! 📺",
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
      id: 8,
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
    // Posts adicionais (página 2)
    {
      id: 13,
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
      id: 14,
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
      id: 16,
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
    // Posts adicionais (página 3)
    {
      id: 17,
      user: {
        name: "king",
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
      id: 18,
      user: {
        name: "Lucas Ferreira",
        username: "lucasferreira",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/user4-oEaMhAjkhQXIKvKErl2GVv0h1l3yex.jpeg",
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
      id: 998,
      isSponsored: true,
      user: {
        name: "GameVerse",
        username: "gameverse_official",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime-profile-purple-8Ol0RxFg4Fc5lF6kbtgahq4XVWL70i.jpeg",
        verified: true,
      },
      content:
        "🎮 GAMERS, PREPAREM-SE! 🎮\n\nO maior evento de games do ano está chegando! GameCon 2025 com lançamentos exclusivos, torneios com premiação de R$100.000 e encontros com seus criadores de conteúdo favoritos!\n\nIngressos limitados com 25% de desconto na pré-venda. Garanta já o seu e não fique de fora dessa experiência épica!",
      time: "Patrocinado",
      likes: 3567,
      comments: 842,
      shares: 721,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime-girl-mouse-LEmDKCG1P7JuhjQPr99G80fKG0JUkH.jpeg",
      cta: "Garantir Ingresso",
      url: "https://gamecon2025.com/tickets",
    },
    {
      id: 9,
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
      id: 11,
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
    // Posts adicionais (página 2)
    {
      id: 19,
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
      id: 21,
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

  const allReels = [
    {
      id: 1,
      title: "Cyberpunk Streamer 🎮",
      thumbnail: "https://i.pinimg.com/videos/thumbnails/originals/86/05/b3/8605b34ad5390deb2319519fc3f0a57e.0000000.jpg",
      views: "12K",
      author: {
        name: "CyberGirl",
        username: "cybergirl",
        avatar: "CG",
      },
    },
    {
      id: 2,
      title: "Keep Out! 💥",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime2-AQbuY3wttA8cehRcL54ejMpOxy25eW.jpeg",
      views: "8.5K",
      author: {
        name: "PinkHacker",
        username: "pinkhacker",
        avatar: "PH",
      },
    },
    {
      id: 3,
      title: "Cyberpunk Squad 🌃",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime3-8K9bSUeFu9VDDMixuxsaEBRy6HDBk6.jpeg",
      views: "24K",
      author: {
        name: "NeonTeam",
        username: "neonteam",
        avatar: "NT",
      },
    },
    {
      id: 4,
      title: "Neon Vibes ✨",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime4-WRasbTaL1mRhhqlCkQkeG1CICEw7Hk.jpeg",
      views: "18K",
      author: {
        name: "VibeMaster",
        username: "vibemaster",
        avatar: "VM",
      },
    },
    {
      id: 5,
      title: "Secret Whisper 🤫",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime5-OZObXmG4r6fGCA2dc4gjfpa2LkuEyA.jpeg",
      views: "32K",
      author: {
        name: "MysticGirl",
        username: "mysticgirl",
        avatar: "MG",
      },
    },
    {
      id: 6,
      title: "Devil Girl 😈",
      thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime6-NrJ4xHr2YU9zBPpJI1kOIcvHl0mtX5.jpeg",
      views: "15K",
      author: {
        name: "DevilQueen",
        username: "devilqueen",
        avatar: "DQ",
      },
    },
  ]

  const handleNextReels = () => {
    if (reelsStartIndex + 3 < allReels.length && !isTransitioning) {
      setSlideDirection("right")
      setIsTransitioning(true)

      if (reelsContainerRef.current) {
        reelsContainerRef.current.classList.add("animate-slide-out-left")

        setTimeout(() => {
          setReelsStartIndex(reelsStartIndex + 1)

          if (reelsContainerRef.current) {
            reelsContainerRef.current.classList.remove("animate-slide-out-left")
            reelsContainerRef.current.classList.add("animate-slide-in-right")

            setTimeout(() => {
              if (reelsContainerRef.current) {
                reelsContainerRef.current.classList.remove("animate-slide-in-right")
              }
              setIsTransitioning(false)
            }, 300)
          }
        }, 300)
      }
    }
  }

  const handlePrevReels = () => {
    if (reelsStartIndex > 0 && !isTransitioning) {
      setSlideDirection("left")
      setIsTransitioning(true)

      if (reelsContainerRef.current) {
        reelsContainerRef.current.classList.add("animate-slide-out-right")

        setTimeout(() => {
          setReelsStartIndex(reelsStartIndex - 1)

          if (reelsContainerRef.current) {
            reelsContainerRef.current.classList.remove("animate-slide-out-right")
            reelsContainerRef.current.classList.add("animate-slide-in-left")

            setTimeout(() => {
              if (reelsContainerRef.current) {
                reelsContainerRef.current.classList.remove("animate-slide-in-left")
              }
              setIsTransitioning(false)
            }, 300)
          }
        }, 300)
      }
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
    <div ref={timelineRef} className={cn("space-y-6", className)} {...props}>
      {/* Static Tab Navigation */}
      <div ref={staticTabsRef}>
        <Card
          className={cn(
            "border-0 bg-white shadow-sm rounded-3xl transition-all duration-400",
            showStaticTabsAnimation && "animate-pulse",
          )}
        >
          <div className="flex">
            <button
              onClick={() => handleTabChange("foryou")}
              className={cn(
                "flex-1 py-4 px-6 text-center font-semibold transition-all relative",
                activeTab === "foryou" ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
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
                activeTab === "following" ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
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
        <Card className="border-0 bg-white shadow-sm rounded-3xl">
          <CardHeader className="pb-2">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/black-hair-anime-girl-53KihlqphLkgA4FU5xkkyJcCkvogK2.jpeg"
                  alt="Avatar"
                />
                <AvatarFallback className="bg-[#1d9bf0] text-white font-semibold">EU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="O que você está pensando?"
                  value={postContent}
                  onChange={handlePostChange}
                  className="min-h-16 resize-none border-0 p-0 text-base placeholder:text-gray-400 focus-visible:ring-0 focus:outline-none bg-transparent"
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
                <div className="flex justify-end mt-1">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isNearLimit ? "text-red-500" : "text-gray-400",
                      postContent.length === 0 ? "opacity-0" : "opacity-100",
                    )}
                  >
                    {remainingCharacters}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Sempre mostrar os botões */}
          <CardFooter className="flex justify-between border-t border-gray-100 px-6 py-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <ImageIcon className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <Video className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                <Smile className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
            <Button
              className="rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold px-6"
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
            <Card className="border-0 bg-white shadow-md rounded-3xl overflow-hidden relative">
              {/* Indicador de anúncio */}
              <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-[#1d9bf0]/10 to-purple-500/10 h-1" />

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
                        <p className="font-bold text-gray-900">{post.user.name}</p>
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
                        <p className="text-gray-500">@{post.user.username}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Badge
                          variant="outline"
                          className="text-xs font-medium bg-[#1d9bf0]/5 text-[#1d9bf0] border-[#1d9bf0]/20 px-2 py-0 h-5 rounded-full"
                        >
                          Patrocinado
                        </Badge>
                        <button className="text-xs text-gray-400 hover:text-gray-500 flex items-center gap-0.5">
                          <Info className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pb-4 space-y-4">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">{post.content}</div>

                {post.image && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-80 object-cover" />
                  </div>
                )}

                <div className="pt-2">
                  <Button className="w-full bg-gradient-to-r from-[#1d9bf0] to-blue-600 hover:from-[#1a8cd8] hover:to-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2">
                    {post.cta}
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="border-t border-gray-100 px-6 py-4">
                <div className="flex w-full justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-500 hover:text-[#1d9bf0] hover:bg-blue-50 rounded-full"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="font-medium">{post.comments}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Repeat2 className="h-4 w-4" />
                    <span className="font-medium">{post.shares}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">{post.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-[#1d9bf0] hover:bg-blue-50 rounded-full"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-0 bg-white shadow-sm rounded-3xl">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
                      <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                        {post.user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{post.user.name}</p>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevelColor(post.user.level)}`}
                        >
                          Lv.{post.user.level}
                        </span>
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
              <div onClick={() => handlePostClick(post.id)} className="cursor-pointer">
                <CardContent className="pb-4">
                  <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>
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
              <CardFooter className="border-t border-gray-100 px-6 py-4">
                <div className="flex w-full justify-between">
                  <div onClick={() => handlePostClick(post.id)} className="flex-1 cursor-pointer">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-gray-500 hover:text-[#1d9bf0] hover:bg-blue-50 rounded-full"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="font-medium">{post.comments}</span>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full"
                  >
                    <Repeat2 className="h-4 w-4" />
                    <span className="font-medium">{post.shares}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="font-medium">{post.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-[#1d9bf0] hover:bg-blue-50 rounded-full"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Reels após o segundo post */}
          {index === 1 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#1d9bf0]" />
                  <h3 className="text-base font-semibold text-gray-900">Clips</h3>
                </div>
                <Button variant="ghost" className="text-[#1d9bf0] hover:bg-blue-50 font-medium text-sm h-8 px-4">
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
                        <div className="cursor-pointer group" style={{ width: "45%" }}>
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ height: "446.7px" }}
                          >
                            <img
                              src={
                                currentReels[0]?.thumbnail ||
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime3-8K9bSUeFu9VDDMixuxsaEBRy6HDBk6.jpeg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={currentReels[0]?.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-blue-500/20 transition-all duration-300" />

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

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                              </div>
                            </div>

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

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Segundo reel - 45% */}
                        <div className="cursor-pointer group" style={{ width: "45%" }}>
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ height: "446.7px" }}
                          >
                            <img
                              src={
                                currentReels[1]?.thumbnail ||
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime2-AQbuY3wttA8cehRcL54ejMpOxy25eW.jpeg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={currentReels[1]?.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-blue-500/20 transition-all duration-300" />

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

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                              </div>
                            </div>

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

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Terceiro reel - 10% (cortado) */}
                        <div className="cursor-pointer group overflow-hidden" style={{ width: "10%" }}>
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ width: "400%", height: "446.7px" }}
                          >
                            <img
                              src={
                                currentReels[2]?.thumbnail ||
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime3-8K9bSUeFu9VDDMixuxsaEBRy6HDBk6.jpeg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={currentReels[2]?.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-blue-500/20 transition-all duration-300" />

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

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                              </div>
                            </div>

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

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
                          </div>
                        </div>
                      </>
                    ) : (
                      // Layout invertido: 1º cortado, 2º e 3º completos
                      <>
                        {/* Primeiro reel - 10% (cortado) */}
                        <div className="cursor-pointer group overflow-hidden" style={{ width: "10%" }}>
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ width: "400%", height: "446.7px", marginLeft: "-300%" }}
                          >
                            <img
                              src={
                                currentReels[0]?.thumbnail ||
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime3-8K9bSUeFu9VDDMixuxsaEBRy6HDBk6.jpeg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={currentReels[0]?.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-blue-500/20 transition-all duration-300" />

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

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                              </div>
                            </div>

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

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Segundo reel - 45% */}
                        <div className="cursor-pointer group" style={{ width: "45%" }}>
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ height: "446.7px" }}
                          >
                            <img
                              src={
                                currentReels[1]?.thumbnail ||
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime2-AQbuY3wttA8cehRcL54ejMpOxy25eW.jpeg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={currentReels[1]?.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-blue-500/20 transition-all duration-300" />

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

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                              </div>
                            </div>

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

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
                          </div>
                        </div>

                        {/* Terceiro reel - 45% */}
                        <div className="cursor-pointer group" style={{ width: "45%" }}>
                          <div
                            className="relative rounded-xl overflow-hidden bg-gray-100 group-hover:shadow-2xl group-hover:shadow-blue-500/20"
                            style={{ height: "446.7px" }}
                          >
                            <img
                              src={
                                currentReels[2]?.thumbnail ||
                                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/anime3-8K9bSUeFu9VDDMixuxsaEBRy6HDBk6.jpeg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={currentReels[2]?.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-all duration-300 group-hover:from-black/40" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-blue-500/20 transition-all duration-300" />

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

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1 transition-all duration-300 group-hover:border-l-[#1d9bf0]" />
                              </div>
                            </div>

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

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Seta de navegação - Próxima (direita) */}
                {canGoNext && (
                  <button
                    onClick={handleNextReels}
                    disabled={isTransitioning}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 transition-colors duration-300 hover:text-[#1d9bf0]" />
                  </button>
                )}

                {/* Seta de navegação - Anterior (esquerda) */}
                {canGoPrev && (
                  <button
                    onClick={handlePrevReels}
                    disabled={isTransitioning}
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 transition-colors duration-300 hover:text-[#1d9bf0]" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Pessoas recomendadas após o terceiro post */}
          {index === 2 && visibleRecommendedUsers.length > 0 && (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50/30 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50/50 to-purple-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg font-bold text-gray-900">Pessoas que você pode conhecer</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-white/80 hover:shadow-md transition-all duration-200 group"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-500 transition-colors duration-200 group-hover:text-gray-700" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 px-6 pb-6">
                {visibleRecommendedUsers
                  .slice(currentRecommendedIndex, currentRecommendedIndex + 3)
                  .map((user, userIndex) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 rounded-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-blue-100/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-14 w-14 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-[#1d9bf0] to-purple-500 text-white font-bold text-lg">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">@{user.username}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <p className="text-xs text-gray-500 font-medium">{user.mutualFriends} amigos em comum</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#1d9bf0] to-blue-600 hover:from-[#1a8cd8] hover:to-blue-700 text-white font-semibold px-6 py-2 h-9 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          Seguir
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </React.Fragment>
      ))}

      {/* Loading indicator e ref para o último post */}
      {currentPosts.length > 0 && (
        <div ref={lastPostRef}>
          {isLoadingMore && (
            <div className="py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d9bf0]"></div>
                <p className="text-gray-500 font-medium">Carregando mais posts...</p>
              </div>
            </div>
          )}

          {!isLoadingMore && currentPosts.length >= currentAllPosts.length && (
            <div className="py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full flex items-center justify-center border border-blue-100/50">
                  <Sparkles className="w-8 h-8 text-[#1d9bf0]" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">Você chegou ao fim do feed!</h3>
                  <p className="text-gray-600">
                    {activeTab === "following"
                      ? "Siga mais pessoas para ver mais conteúdo!"
                      : "Descubra novos criadores e conteúdos incríveis!"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-[#1d9bf0] to-blue-600 hover:from-[#1a8cd8] hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    {activeTab === "following" ? "Encontrar Pessoas" : "Explorar"}
                  </Button>
                  {activeTab === "following" && (
                    <Button
                      variant="outline"
                      onClick={() => handleTabChange("foryou", true)}
                      className="border-[#1d9bf0]/20 text-[#1d9bf0] hover:bg-blue-50 font-semibold px-6 py-2 rounded-full transition-all duration-300"
                    >
                      Ver For You
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Tab Navigation - Appears when scrolled */}
      {showFloatingTabs && tabsWidth && (
        <div
          className="fixed top-[3rem] left-1/2 transform -translate-x-1/2 z-50 slide-in-from-top"
          style={{ width: `${tabsWidth}px` }}
        >
          <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-b-3xl border border-white/20 ring-1 ring-black/5">
            <div className="flex">
              <button
                onClick={() => handleTabChange("foryou", true)}
                className={cn(
                  "flex-1 py-4 px-6 text-center font-semibold transition-all relative",
                  activeTab === "foryou" ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
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
                  activeTab === "following" ? "text-gray-900" : "text-gray-500 hover:text-gray-700",
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
