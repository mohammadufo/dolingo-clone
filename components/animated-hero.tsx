'use client'

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { useEffect, useRef } from 'react'

export function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150])

  // Mouse tracking for interactive 3D effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [5, -5]), {
    stiffness: 100,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-5, 5]), {
    stiffness: 100,
    damping: 30,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={containerRef}
      className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] perspective-1000"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1080 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))' }}
      >
        <defs>
          {/* Animated Gradients */}
          <motion.linearGradient
            id="animatedGradient1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <motion.stop
              offset="0%"
              stopColor="#58CC02"
              animate={{ stopColor: ['#58CC02', '#4CAF50', '#58CC02'] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <motion.stop
              offset="100%"
              stopColor="#1CB0F6"
              animate={{ stopColor: ['#1CB0F6', '#2196F3', '#1CB0F6'] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </motion.linearGradient>

          <motion.radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFC800" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFC800" stopOpacity="0" />
          </motion.radialGradient>

          {/* Filters */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background with morphing shape */}
        <motion.circle
          cx="540"
          cy="540"
          r="480"
          fill="#F7F7F7"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />

        {/* Animated background particles */}
        {[...Array(8)].map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            cx={200 + i * 120}
            cy={200 + (i % 3) * 200}
            r="4"
            fill={i % 3 === 0 ? '#58CC02' : i % 3 === 1 ? '#1CB0F6' : '#FFC800'}
            opacity="0.3"
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Left Character - Complex entrance with 3D rotation */}
        <motion.g
          initial={{ x: -200, opacity: 0, rotateY: -90 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ y: y1 }}
        >
          {/* Character body with gradient */}
          <motion.path
            d="M280 520C280 480 300 460 340 460C380 460 400 480 400 520V720C400 760 380 780 340 780C300 780 280 760 280 720V520Z"
            fill="url(#animatedGradient1)"
            animate={{
              y: [0, -12, 0],
              scaleY: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            filter="url(#glow)"
          />

          <motion.g
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3.5,
              times: [0, 0.4, 0.5, 0.6, 1],
            }}
          >
            <ellipse cx="320" cy="540" rx="18" ry="20" fill="#FFFFFF" />
            <ellipse cx="360" cy="540" rx="18" ry="20" fill="#FFFFFF" />
          </motion.g>
          <motion.ellipse
            cx="320"
            cy="540"
            rx="10"
            ry="12"
            fill="#000000"
            animate={{
              x: [0, 4, 0, -4, 0],
              y: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.ellipse
            cx="360"
            cy="540"
            rx="10"
            ry="12"
            fill="#000000"
            animate={{
              x: [0, 4, 0, -4, 0],
              y: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          {/* Eye highlights for more life */}
          <motion.circle cx="323" cy="536" r="4" fill="#FFFFFF" opacity="0.9" />
          <motion.circle cx="363" cy="536" r="4" fill="#FFFFFF" opacity="0.9" />

          <motion.path
            d="M305 580Q340 610 375 580"
            stroke="#000000"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [
                'M305 580Q340 610 375 580',
                'M305 585Q340 618 375 585',
                'M305 580Q340 610 375 580',
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
          />
          {/* Smile dimples for extra charm */}
          <motion.circle
            cx="300"
            cy="585"
            r="3"
            fill="#000000"
            opacity="0.2"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            cx="380"
            cy="585"
            r="3"
            fill="#000000"
            opacity="0.2"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />

          {/* Left arm with hand */}
          <motion.g
            animate={{
              rotate: [0, -20, 5, -20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
            style={{ transformOrigin: '280px 580px' }}
          >
            <ellipse cx="260" cy="600" rx="25" ry="60" fill="#58CC02" />
            {/* Hand with fingers */}
            <motion.ellipse
              cx="250"
              cy="650"
              rx="30"
              ry="28"
              fill="#58CC02"
              animate={{
                rotate: [0, -15, 0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: '260px 640px' }}
            />
            {/* Thumb */}
            <motion.ellipse
              cx="270"
              cy="655"
              rx="12"
              ry="18"
              fill="#58CC02"
              animate={{
                rotate: [0, 20, 0, 15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
          </motion.g>

          {/* Right arm with hand */}
          <motion.g
            animate={{
              rotate: [0, 20, -5, 20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.45, 0.05, 0.55, 0.95],
              delay: 0.3,
            }}
            style={{ transformOrigin: '400px 580px' }}
          >
            <ellipse cx="420" cy="600" rx="25" ry="60" fill="#58CC02" />
            {/* Hand with fingers */}
            <motion.ellipse
              cx="430"
              cy="650"
              rx="30"
              ry="28"
              fill="#58CC02"
              animate={{
                rotate: [0, 15, 0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.3,
              }}
              style={{ transformOrigin: '420px 640px' }}
            />
            {/* Thumb */}
            <motion.ellipse
              cx="410"
              cy="655"
              rx="12"
              ry="18"
              fill="#58CC02"
              animate={{
                rotate: [0, -20, 0, -15, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.3,
              }}
            />
          </motion.g>
        </motion.g>

        {/* Center Character - Slide up with bounce */}
        <motion.g
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 1,
            delay: 0.4,
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
          style={{ y: y2 }}
        >
          <motion.path
            d="M480 500C480 460 500 440 540 440C580 440 600 460 600 500V700C600 740 580 760 540 760C500 760 480 740 480 700V500Z"
            fill="#FF4B4B"
            animate={{
              y: [0, -15, 0],
              scaleX: [1, 1.05, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            filter="url(#glow)"
          />

          <motion.g>
            <ellipse cx="520" cy="530" rx="20" ry="22" fill="#FFFFFF" />
            <ellipse cx="560" cy="530" rx="20" ry="22" fill="#FFFFFF" />
            <motion.ellipse
              cx="520"
              cy="530"
              rx="12"
              ry="14"
              fill="#000000"
              animate={{
                scale: [1, 1.15, 1],
                x: [0, 3, 0, -3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <motion.ellipse
              cx="560"
              cy="530"
              rx="12"
              ry="14"
              fill="#000000"
              animate={{
                scale: [1, 1.15, 1],
                x: [0, 3, 0, -3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.1,
              }}
            />
            {/* Eye sparkles */}
            <motion.circle
              cx="524"
              cy="525"
              r="5"
              fill="#FFFFFF"
              opacity="0.95"
            />
            <motion.circle
              cx="564"
              cy="525"
              r="5"
              fill="#FFFFFF"
              opacity="0.95"
            />
            <motion.circle
              cx="516"
              cy="533"
              r="3"
              fill="#FFFFFF"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <motion.circle
              cx="556"
              cy="533"
              r="3"
              fill="#FFFFFF"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </motion.g>

          <motion.path
            d="M505 570Q540 605 575 570"
            stroke="#000000"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [
                'M505 570Q540 605 575 570',
                'M505 575Q540 612 575 575',
                'M505 570Q540 605 575 570',
              ],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.45, 0.05, 0.55, 0.95],
            }}
          />
          {/* Smile dimples */}
          <motion.circle
            cx="500"
            cy="575"
            r="3"
            fill="#000000"
            opacity="0.2"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            cx="580"
            cy="575"
            r="3"
            fill="#000000"
            opacity="0.2"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />

          <motion.g
            animate={{
              rotate: [0, -15, 0, -10, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '480px 580px' }}
          >
            <ellipse cx="460" cy="610" rx="24" ry="58" fill="#FF4B4B" />
            <motion.ellipse
              cx="450"
              cy="660"
              rx="28"
              ry="26"
              fill="#FF4B4B"
              animate={{
                rotate: [0, -12, 0],
              }}
              transition={{
                duration: 2.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
          </motion.g>

          <motion.g
            animate={{
              rotate: [0, 15, 0, 10, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            style={{ transformOrigin: '600px 580px' }}
          >
            <ellipse cx="620" cy="610" rx="24" ry="58" fill="#FF4B4B" />
            <motion.ellipse
              cx="630"
              cy="660"
              rx="28"
              ry="26"
              fill="#FF4B4B"
              animate={{
                rotate: [0, 12, 0],
              }}
              transition={{
                duration: 2.8,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.4,
              }}
            />
          </motion.g>
        </motion.g>

        {/* Right Character - Slide in from right with rotation */}
        <motion.g
          initial={{ x: 200, opacity: 0, rotate: 45 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{
            duration: 1.2,
            delay: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ y: y1 }}
        >
          <motion.path
            d="M680 520C680 480 700 460 740 460C780 460 800 480 800 520V720C800 760 780 780 740 780C700 780 680 760 680 720V520Z"
            fill="#1CB0F6"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            filter="url(#glow)"
          />

          <motion.g
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 4.5,
              times: [0, 0.4, 0.5, 0.6, 1],
            }}
          >
            <ellipse cx="720" cy="540" rx="18" ry="20" fill="#FFFFFF" />
            <ellipse cx="760" cy="540" rx="18" ry="20" fill="#FFFFFF" />
          </motion.g>
          <motion.ellipse
            cx="720"
            cy="540"
            rx="10"
            ry="12"
            fill="#000000"
            animate={{
              x: [0, -4, 0, 4, 0],
              y: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.ellipse
            cx="760"
            cy="540"
            rx="10"
            ry="12"
            fill="#000000"
            animate={{
              x: [0, -4, 0, 4, 0],
              y: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.circle cx="723" cy="536" r="4" fill="#FFFFFF" opacity="0.9" />
          <motion.circle cx="763" cy="536" r="4" fill="#FFFFFF" opacity="0.9" />

          <motion.path
            d="M705 580Q740 610 775 580"
            stroke="#000000"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: [
                'M705 580Q740 610 775 580',
                'M705 585Q740 618 775 585',
                'M705 580Q740 610 775 580',
              ],
            }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: [0.45, 0.05, 0.55, 0.95],
              delay: 0.5,
            }}
          />
          <motion.circle
            cx="700"
            cy="585"
            r="3"
            fill="#000000"
            opacity="0.2"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
          <motion.circle
            cx="780"
            cy="585"
            r="3"
            fill="#000000"
            opacity="0.2"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />

          <motion.g
            animate={{
              rotate: [0, -18, 0, -12, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            style={{ transformOrigin: '680px 580px' }}
          >
            <ellipse cx="660" cy="610" rx="24" ry="58" fill="#1CB0F6" />
            <motion.ellipse
              cx="650"
              cy="660"
              rx="28"
              ry="26"
              fill="#1CB0F6"
              animate={{
                rotate: [0, -15, 0],
              }}
              transition={{
                duration: 3.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
          </motion.g>

          <motion.g
            animate={{
              rotate: [0, 18, 0, 12, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            style={{ transformOrigin: '800px 580px' }}
          >
            <ellipse cx="820" cy="610" rx="24" ry="58" fill="#1CB0F6" />
            <motion.ellipse
              cx="830"
              cy="660"
              rx="28"
              ry="26"
              fill="#1CB0F6"
              animate={{
                rotate: [0, 15, 0],
              }}
              transition={{
                duration: 3.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </motion.g>
        </motion.g>

        {/* Speech Bubbles with advanced animations */}
        <motion.g
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            delay: 1,
            type: 'spring',
            stiffness: 150,
            damping: 12,
          }}
          style={{ y: y3 }}
        >
          <motion.rect
            x="220"
            y="320"
            width="160"
            height="90"
            rx="25"
            fill="#FFFFFF"
            stroke="#E5E5E5"
            strokeWidth="4"
            animate={{
              y: [0, -8, 0],
              rotate: [0, -2, 0, 2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            filter="url(#glow)"
          />
          <motion.path
            d="M300 410L285 435L320 415Z"
            fill="#FFFFFF"
            stroke="#E5E5E5"
            strokeWidth="4"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.text
            x="300"
            y="375"
            fontSize="42"
            fontWeight="bold"
            textAnchor="middle"
            fill="#58CC02"
            animate={{
              scale: [1, 1.1, 1],
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            ¡Hola!
          </motion.text>
        </motion.g>

        <motion.g
          initial={{ scale: 0, opacity: 0, rotate: 180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.2,
            type: 'spring',
            stiffness: 150,
            damping: 12,
          }}
          style={{ y: y3 }}
        >
          <motion.rect
            x="700"
            y="320"
            width="160"
            height="90"
            rx="25"
            fill="#FFFFFF"
            stroke="#E5E5E5"
            strokeWidth="4"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            filter="url(#glow)"
          />
          <motion.path
            d="M780 410L765 435L800 415Z"
            fill="#FFFFFF"
            stroke="#E5E5E5"
            strokeWidth="4"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.3,
            }}
          />
          <motion.text
            x="780"
            y="375"
            fontSize="42"
            fontWeight="bold"
            textAnchor="middle"
            fill="#1CB0F6"
            animate={{
              scale: [1, 1.1, 1],
              y: [0, -2, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          >
            Hello!
          </motion.text>
        </motion.g>

        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.4,
            type: 'spring',
            stiffness: 150,
            damping: 12,
          }}
        >
          <motion.rect
            x="460"
            y="280"
            width="160"
            height="90"
            rx="25"
            fill="#FFFFFF"
            stroke="#E5E5E5"
            strokeWidth="4"
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            filter="url(#glow)"
          />
          <motion.path
            d="M540 370L525 395L560 375Z"
            fill="#FFFFFF"
            stroke="#E5E5E5"
            strokeWidth="4"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
          <motion.text
            x="540"
            y="335"
            fontSize="42"
            fontWeight="bold"
            textAnchor="middle"
            fill="#FF4B4B"
            animate={{
              scale: [1, 1.12, 1],
              rotate: [0, -3, 0, 3, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          >
            !سلام
          </motion.text>
        </motion.g>

        {/* Decorative Stars with complex animations */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          {[
            { x: 180, y: 380, color: '#FFC800', delay: 0 },
            { x: 900, y: 380, color: '#FF4B4B', delay: 0.3 },
            { x: 540, y: 200, color: '#58CC02', delay: 0.6 },
            { x: 350, y: 250, color: '#1CB0F6', delay: 0.9 },
            { x: 730, y: 250, color: '#FFC800', delay: 1.2 },
          ].map((star, i) => (
            <motion.g key={`star-${i}`}>
              <motion.circle
                cx={star.x}
                cy={star.y}
                r="20"
                fill="url(#glowGradient)"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: star.delay,
                }}
              />
              <motion.path
                d={`M${star.x} ${star.y - 15}L${star.x + 5} ${star.y - 5}L${
                  star.x + 15
                } ${star.y}L${star.x + 5} ${star.y + 5}L${star.x} ${
                  star.y + 15
                }L${star.x - 5} ${star.y + 5}L${star.x - 15} ${star.y}L${
                  star.x - 5
                } ${star.y - 5}Z`}
                fill={star.color}
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: star.delay,
                }}
                filter="url(#glow)"
              />
            </motion.g>
          ))}
        </motion.g>

        {/* Floating Hearts with trail effect */}
        {[...Array(5)].map((_, i) => (
          <motion.g
            key={`heart-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 2 + i * 1,
            }}
          >
            <motion.path
              d={`M${400 + i * 70} 750C${400 + i * 70} 750 ${
                390 + i * 70
              } 740 ${380 + i * 70} 740C${370 + i * 70} 740 ${
                365 + i * 70
              } 745 ${365 + i * 70} 755C${365 + i * 70} 765 ${
                375 + i * 70
              } 775 ${400 + i * 70} 790C${425 + i * 70} 775 ${
                435 + i * 70
              } 765 ${435 + i * 70} 755C${435 + i * 70} 745 ${
                430 + i * 70
              } 740 ${420 + i * 70} 740C${410 + i * 70} 740 ${
                400 + i * 70
              } 750 ${400 + i * 70} 750Z`}
              fill="#FF4B4B"
              animate={{
                y: [0, -150],
                x: [0, Math.sin(i) * 30, 0],
                scale: [0.5, 1, 0.8],
                opacity: [0, 1, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeOut',
                delay: 2 + i * 1,
              }}
              filter="url(#glow)"
            />
          </motion.g>
        ))}

        {/* Book with page flip animation */}
        <motion.g
          initial={{ opacity: 0, y: 50, rotate: -30 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.8,
            type: 'spring',
            stiffness: 100,
          }}
        >
          <motion.rect
            x="140"
            y="650"
            width="100"
            height="120"
            rx="10"
            fill="#1CB0F6"
            animate={{
              rotate: [-3, 3, -3],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            filter="url(#glow)"
          />
          <motion.rect
            x="150"
            y="665"
            width="80"
            height="5"
            fill="#FFFFFF"
            animate={{
              scaleX: [1, 0.95, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.rect
            x="150"
            y="685"
            width="80"
            height="5"
            fill="#FFFFFF"
            animate={{
              scaleX: [1, 0.95, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.2,
            }}
          />
          <motion.rect
            x="150"
            y="705"
            width="80"
            height="5"
            fill="#FFFFFF"
            animate={{
              scaleX: [1, 0.95, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.4,
            }}
          />
          {/* Page flip effect */}
          <motion.rect
            x="190"
            y="650"
            width="50"
            height="120"
            rx="10"
            fill="#FFFFFF"
            opacity="0.7"
            animate={{
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              repeatDelay: 1,
            }}
            style={{ transformOrigin: '190px 710px' }}
          />
        </motion.g>

        {/* Trophy with shine effect */}
        <motion.g
          initial={{ opacity: 0, y: 50, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 2,
            type: 'spring',
            stiffness: 120,
          }}
        >
          <motion.path
            d="M840 650L820 670L820 710L860 710L860 670L840 650Z"
            fill="#FFC800"
            animate={{
              y: [0, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            filter="url(#glow)"
          />
          <motion.rect
            x="815"
            y="710"
            width="50"
            height="25"
            rx="5"
            fill="#FFC800"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            cx="840"
            cy="680"
            r="12"
            fill="#FFFFFF"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          {/* Shine effect */}
          <motion.path
            d="M825 660L830 665L835 660L830 655Z"
            fill="#FFFFFF"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              repeatDelay: 1,
            }}
          />
        </motion.g>

        {/* Confetti particles */}
        {[...Array(12)].map((_, i) => (
          <motion.rect
            key={`confetti-${i}`}
            x={300 + i * 50}
            y={150}
            width="8"
            height="8"
            rx="2"
            fill={
              i % 4 === 0
                ? '#58CC02'
                : i % 4 === 1
                ? '#1CB0F6'
                : i % 4 === 2
                ? '#FF4B4B'
                : '#FFC800'
            }
            animate={{
              y: [150, 900],
              x: [300 + i * 50, 300 + i * 50 + Math.sin(i) * 100],
              rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Pencil */}
        <motion.g
          initial={{ opacity: 0, y: 50, rotate: -45 }}
          animate={{ opacity: 1, y: 0, rotate: -25 }}
          transition={{
            duration: 0.8,
            delay: 2.2,
            type: 'spring',
            stiffness: 100,
          }}
        >
          <motion.rect
            x="380"
            y="820"
            width="80"
            height="15"
            rx="3"
            fill="#FFC800"
            animate={{
              rotate: [-25, -20, -25],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '420px 827px' }}
          />
          <motion.path
            d="M460 820L475 827.5L460 835Z"
            fill="#FF4B4B"
            animate={{
              rotate: [-25, -20, -25],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '420px 827px' }}
          />
          <motion.rect
            x="385"
            y="822"
            width="15"
            height="11"
            fill="#FF8C00"
            animate={{
              rotate: [-25, -20, -25],
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '420px 827px' }}
          />
        </motion.g>

        {/* Notebook */}
        <motion.g
          initial={{ opacity: 0, y: 50, rotate: 15 }}
          animate={{ opacity: 1, y: 0, rotate: 8 }}
          transition={{
            duration: 0.8,
            delay: 2.4,
            type: 'spring',
            stiffness: 100,
          }}
        >
          <motion.rect
            x="520"
            y="810"
            width="90"
            height="110"
            rx="5"
            fill="#58CC02"
            animate={{
              rotate: [8, 12, 8],
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            style={{ transformOrigin: '565px 865px' }}
            filter="url(#glow)"
          />
          <motion.rect
            x="530"
            y="830"
            width="70"
            height="3"
            fill="#FFFFFF"
            opacity="0.8"
            animate={{
              rotate: [8, 12, 8],
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            style={{ transformOrigin: '565px 865px' }}
          />
          <motion.rect
            x="530"
            y="850"
            width="70"
            height="3"
            fill="#FFFFFF"
            opacity="0.8"
            animate={{
              rotate: [8, 12, 8],
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            style={{ transformOrigin: '565px 865px' }}
          />
          <motion.rect
            x="530"
            y="870"
            width="70"
            height="3"
            fill="#FFFFFF"
            opacity="0.8"
            animate={{
              rotate: [8, 12, 8],
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.3,
            }}
            style={{ transformOrigin: '565px 865px' }}
          />
          {/* Spiral binding */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={`spiral-${i}`}
              cx={530 + i * 15}
              cy="820"
              r="3"
              fill="#FFFFFF"
              animate={{
                rotate: [8, 12, 8],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
                delay: 0.3,
              }}
              style={{ transformOrigin: '565px 865px' }}
            />
          ))}
        </motion.g>

        {/* Globe/Language Symbol */}
        <motion.g
          initial={{ opacity: 0, y: 50, scale: 0 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 2.6,
            type: 'spring',
            stiffness: 120,
          }}
        >
          <motion.circle
            cx="650"
            cy="860"
            r="40"
            fill="#1CB0F6"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              },
              rotate: {
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              },
            }}
            filter="url(#glow)"
          />
          {/* Globe lines */}
          <motion.ellipse
            cx="650"
            cy="860"
            rx="40"
            ry="20"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.line
            x1="650"
            y1="820"
            x2="650"
            y2="900"
            stroke="#FFFFFF"
            strokeWidth="3"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
          <motion.path
            d="M630 860Q650 840 670 860Q650 880 630 860"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />
        </motion.g>

        {/* ABC Blocks */}
        <motion.g
          initial={{ opacity: 0, y: 50, rotate: -20 }}
          animate={{ opacity: 1, y: 0, rotate: -10 }}
          transition={{
            duration: 0.8,
            delay: 2.8,
            type: 'spring',
            stiffness: 100,
          }}
        >
          <motion.rect
            x="280"
            y="850"
            width="50"
            height="50"
            rx="5"
            fill="#FF4B4B"
            animate={{
              rotate: [-10, -5, -10],
              y: [0, -7, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.1,
            }}
            style={{ transformOrigin: '305px 875px' }}
            filter="url(#glow)"
          />
          <motion.text
            x="305"
            y="885"
            fontSize="32"
            fontWeight="bold"
            textAnchor="middle"
            fill="#FFFFFF"
            animate={{
              rotate: [-10, -5, -10],
              y: [0, -7, 0],
            }}
            transition={{
              duration: 2.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.1,
            }}
            style={{ transformOrigin: '305px 875px' }}
          >
            A
          </motion.text>
        </motion.g>

        <motion.g
          initial={{ opacity: 0, y: 50, rotate: 15 }}
          animate={{ opacity: 1, y: 0, rotate: 10 }}
          transition={{
            duration: 0.8,
            delay: 3,
            type: 'spring',
            stiffness: 100,
          }}
        >
          <motion.rect
            x="340"
            y="870"
            width="50"
            height="50"
            rx="5"
            fill="#FFC800"
            animate={{
              rotate: [10, 15, 10],
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            style={{ transformOrigin: '365px 895px' }}
            filter="url(#glow)"
          />
          <motion.text
            x="365"
            y="905"
            fontSize="32"
            fontWeight="bold"
            textAnchor="middle"
            fill="#FFFFFF"
            animate={{
              rotate: [10, 15, 10],
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            style={{ transformOrigin: '365px 895px' }}
          >
            B
          </motion.text>
        </motion.g>
      </svg>
    </motion.div>
  )
}
