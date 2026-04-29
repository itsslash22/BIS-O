"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"

interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
}

export function LocationMap({
  location = "Reduto, Belém - PA",
  coordinates = "1.4507° S, 48.4902° W",
  className,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative cursor-pointer select-none ${className}`}
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-black border border-white/10"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          width: isExpanded ? (window.innerWidth < 768 ? 300 : 500) : (window.innerWidth < 768 ? 240 : 320),
          height: isExpanded ? (window.innerWidth < 768 ? 240 : 350) : (window.innerWidth < 768 ? 140 : 180),
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 35,
        }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-red-900/20" />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Satellite Style Background Layer */}
              <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
                 {/* Fake Satellite Texture */}
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
                 <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-black/40" />
              </div>

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* R. 28 de Setembro - Diagonal road as seen in the screenshot */}
                <motion.line
                  x1="-10%"
                  y1="80%"
                  x2="110%"
                  y2="20%"
                  className="stroke-white/20"
                  strokeWidth="8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
                <motion.line
                  x1="-10%"
                  y1="80%"
                  x2="110%"
                  y2="20%"
                  className="stroke-white/5"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />

                {/* Secondary diagonal street */}
                <motion.line
                  x1="40%"
                  y1="-10%"
                  x2="90%"
                  y2="110%"
                  className="stroke-white/10"
                  strokeWidth="5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />

                {/* Building Blocks for Satellite feel */}
                <rect x="15" y="45" width="20" height="25" className="fill-white/5 stroke-white/10" rx="1" />
                <rect x="40" y="20" width="15" height="15" className="fill-white/5 stroke-white/10" rx="1" />
                <rect x="65" y="45" width="25" height="30" className="fill-white/5 stroke-white/10" rx="1" />
                <rect x="45" y="75" width="20" height="15" className="fill-white/10 stroke-white/10" rx="1" />
              </svg>

              {/* Floating Street Name */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1 }}
                className="absolute top-[45%] left-[25%] -rotate-[28deg] text-[8px] font-bold text-white tracking-[0.3em] uppercase pointer-events-none"
              >
                R. 28 de Setembro
              </motion.div>

              {/* Action Button: Open in Google Maps */}
              <motion.a
                href="https://www.google.com/maps/search/?api=1&query=R.+28+de+Setembro,+600+-+Reduto,+Belém+-+PA"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                className="absolute bottom-6 right-6 z-30 pointer-events-auto bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 group transition-all"
              >
                <span className="text-[8px] font-bold text-white tracking-[0.2em] uppercase">Abrir no Maps</span>
                <motion.svg 
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
                  className="text-red-700 group-hover:translate-x-1 transition-transform"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </motion.svg>
              </motion.a>

              {/* Enhanced Map Pin - Glow Effect */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
              >
                {/* Glow behind pin */}
                <div className="absolute inset-0 bg-red-600 blur-xl opacity-40 rounded-full scale-150" />
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="relative z-10 drop-shadow-[0_0_15px_rgba(185,28,28,0.6)]"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#b91c1c" />
                  <circle cx="12" cy="9" r="2.5" className="fill-black" />
                </svg>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid pattern - only show when collapsed */}
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          animate={{ opacity: isExpanded ? 0 : 0.03 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-5">
          {/* Top section */}
          <div className="flex items-start justify-between">
            <div className="relative">
              <motion.div
                className="relative"
                animate={{
                  opacity: isExpanded ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-700"
                  animate={{
                    filter: isHovered
                      ? "drop-shadow(0 0 8px rgba(185, 28, 28, 0.6))"
                      : "drop-shadow(0 0 4px rgba(185, 28, 28, 0.3))",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" x2="9" y1="3" y2="18" />
                  <line x1="15" x2="15" y1="6" y2="21" />
                </motion.svg>
              </motion.div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="space-y-1">
            <motion.h3
              className="text-white font-medium text-sm tracking-tight"
              animate={{
                x: isHovered ? 4 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {location}
            </motion.h3>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-1"
                >
                  <p className="text-red-700 text-[10px] font-bold uppercase tracking-widest">
                    R. 28 de Setembro
                  </p>
                  <p className="text-gray-500 text-xs font-mono">
                    {coordinates}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animated underline */}
            <motion.div
              className="h-px bg-gradient-to-r from-red-700/50 via-red-700/30 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{
                scaleX: isHovered || isExpanded ? 1 : 0.3,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

      </motion.div>

      {/* Click hint */}
      <motion.p
        className="absolute -bottom-6 left-1/2 text-[10px] text-gray-500 whitespace-nowrap"
        style={{ x: "-50%" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered && !isExpanded ? 1 : 0,
          y: isHovered ? 0 : 4,
        }}
        transition={{ duration: 0.2 }}
      >
        Clique para ver no mapa
      </motion.p>
    </motion.div>
  )
}
