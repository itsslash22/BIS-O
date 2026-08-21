import type React from "react"
import { useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { MapPin, Navigation, Maximize2 } from "lucide-react"
import {
  MAPS_DIRECTIONS_LINK,
  OSM_EMBED_URL,
  OSM_PAGE_URL,
  STUDIO,
  WAZE_LINK,
} from "../../constants"
import { useIsMobile } from "../../hooks/useIsMobile"

interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
}

/**
 * Deixa o mapa claro do OpenStreetMap preto e cinza, para não brigar com o
 * resto da página. `invert + hue-rotate` é o truque padrão: inverte o brilho
 * sem trocar as cores de lugar; o grayscale mata os verdes e azuis para que o
 * único ponto colorido na tela continue sendo o vermelho da marca.
 */
const DARK_MAP_FILTER =
  "invert(1) hue-rotate(180deg) grayscale(0.6) brightness(0.92) contrast(1.05)"

export function LocationMap({
  location = STUDIO.name,
  coordinates = STUDIO.coordinates,
  className,
}: LocationMapProps) {
  /**
   * Fachada: o mapa de verdade é um iframe de terceiro, pesado e com requisições
   * próprias. Ele só entra no DOM quando a pessoa pede. Até lá o card é HTML
   * local — nada carrega, nada é requisitado, e a informação que importa
   * (nome, rua, botões de rota) já está à vista.
   */
  const [showMap, setShowMap] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [6, -6])
  const rotateY = useTransform(mouseX, [-50, 50], [-6, 6])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  // A inclinação 3D só faz sentido antes do mapa carregar: girar um iframe
  // atrapalha o arrasto e o zoom dentro dele.
  const tiltActive = !showMap && !isMobile

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !tiltActive) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (rect.left + rect.width / 2))
    mouseY.set(e.clientY - (rect.top + rect.height / 2))
  }

  const resetTilt = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <div className={`w-full max-w-[420px] ${className ?? ""}`}>
      <motion.div
        ref={containerRef}
        style={{ perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={resetTilt}
      >
        <motion.div
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
          style={{
            rotateX: tiltActive ? springRotateX : 0,
            rotateY: tiltActive ? springRotateY : 0,
            transformStyle: "preserve-3d",
          }}
        >
          {/*
            O mapa é montado assim que showMap vira true, fora do AnimatePresence.
            Com `mode="wait"` ele só apareceria depois da fachada terminar de sair —
            isto é, o carregamento do iframe ficava esperando uma animação.
            A fachada agora sai por cima, enquanto o mapa já está buscando os tiles.
          */}
          {showMap && (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <iframe
                  src={OSM_EMBED_URL}
                  title={`Mapa de ${STUDIO.street}, ${STUDIO.district}, ${STUDIO.city}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full border-0"
                  style={{ filter: DARK_MAP_FILTER }}
                />

                {/* Véu levíssimo para casar o mapa com o preto da página. */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <a
                  href={OSM_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3 py-2 backdrop-blur-md transition-colors hover:bg-black"
                >
                  <Maximize2 size={11} className="text-red-500" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">Ampliar</span>
                </a>
              </motion.div>
          )}

          <AnimatePresence>
            {!showMap && (
              <motion.button
                key="facade"
                type="button"
                onClick={() => setShowMap(true)}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                aria-label="Carregar o mapa interativo do estúdio"
                className="group absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-neutral-950 text-center"
              >
                {/* Malha discreta, só para o card não ser um retângulo vazio. */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                        <path d="M 28 0 L 0 0 0 28" fill="none" className="stroke-white" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#map-grid)" />
                  </svg>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-900/15 via-transparent to-black/60" />

                <div className="relative">
                  <div className="absolute inset-0 scale-[2.2] rounded-full bg-red-600 opacity-25 blur-xl transition-opacity duration-500 group-hover:opacity-40" />
                  <MapPin
                    size={34}
                    className="relative text-red-600 drop-shadow-[0_0_14px_rgba(185,28,28,0.6)] transition-transform duration-500 group-hover:-translate-y-1"
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="relative px-6">
                  <p className="font-logo text-[11px] uppercase tracking-[0.3em] text-white">{location}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    {STUDIO.street} — {STUDIO.district}
                  </p>
                </div>

                <span className="relative mt-1 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-md transition-colors duration-500 group-hover:border-red-700/60 group-hover:bg-red-700">
                  Ver mapa
                </span>

                <motion.div
                  className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-red-700 via-red-700/40 to-transparent"
                  initial={{ width: "30%" }}
                  animate={{ width: isHovered ? "100%" : "30%" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/*
        Rota, não só "abrir no mapa". E os dois apps, porque no Brasil a
        divisão entre Google Maps e Waze é real.
      */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={MAPS_DIRECTIONS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-3 rounded-full bg-red-700 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-colors duration-500 hover:bg-white hover:text-black"
        >
          <Navigation size={13} />
          Traçar rota
        </a>
        <a
          href={WAZE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 rounded-full border border-white/15 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white/80 transition-colors duration-500 hover:border-white/40 hover:text-white"
        >
          Waze
        </a>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] text-gray-500 sm:text-left">{coordinates}</p>
    </div>
  )
}
