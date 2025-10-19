import { useEffect, useRef } from 'react'
import { useAppStore } from '@/lib/store'

// 상수 정의
const PARTICLE_GROUPS = ['blue', 'purple', 'cyan', 'indigo'] as const
const MAX_PARTICLES = 200
const MAX_MERGE_SIZE = 8
const MAX_MERGED_SIZE = 10
const MERGE_SIZE_MULTIPLIER = 1.2
const CLICK_RADIUS_MULTIPLIER = 2
const CLICK_RADIUS_BASE = 20
const CONNECTION_DISTANCE = 100
const CONNECTION_OPACITY_BASE = 0.1
const PARTICLE_SPEED_BASE = 0.5
const PARTICLE_SIZE_RANGE = { min: 1, max: 3 }
const PARTICLE_OPACITY_RANGE = { min: 0.1, max: 0.3 }

// 타입 정의 개선
type ParticleGroup = typeof PARTICLE_GROUPS[number]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  group: ParticleGroup
  id: string
}

// 유틸리티 함수들
const getHueForGroup = (group: ParticleGroup): number => {
  const hueRanges = {
    blue: { min: 210, max: 240 },
    purple: { min: 270, max: 300 },
    cyan: { min: 180, max: 210 },
    indigo: { min: 240, max: 270 }
  }

  const range = hueRanges[group]
  return Math.random() * (range.max - range.min) + range.min
}

const generateParticleId = (type: 'particle' | 'merged' | 'burst' = 'particle'): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const createParticle = (canvasWidth: number, canvasHeight: number): Particle => {
  const group = PARTICLE_GROUPS[Math.floor(Math.random() * PARTICLE_GROUPS.length)]
  const hue = getHueForGroup(group)

  return {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * PARTICLE_SPEED_BASE,
    vy: (Math.random() - 0.5) * PARTICLE_SPEED_BASE,
    size: Math.random() * (PARTICLE_SIZE_RANGE.max - PARTICLE_SIZE_RANGE.min) + PARTICLE_SIZE_RANGE.min,
    opacity: Math.random() * (PARTICLE_OPACITY_RANGE.max - PARTICLE_OPACITY_RANGE.min) + PARTICLE_OPACITY_RANGE.min,
    hue,
    group,
    id: generateParticleId()
  }
}

const createMergedParticle = (particle1: Particle, particle2: Particle): Particle => {
  const newSize = Math.min((particle1.size + particle2.size) * MERGE_SIZE_MULTIPLIER, MAX_MERGED_SIZE)
  const newX = (particle1.x + particle2.x) / 2
  const newY = (particle1.y + particle2.y) / 2

  return {
    x: newX,
    y: newY,
    vx: (particle1.vx + particle2.vx) / 2,
    vy: (particle1.vy + particle2.vy) / 2,
    size: newSize,
    opacity: Math.min((particle1.opacity + particle2.opacity) / 2, 0.8),
    hue: particle1.hue,
    group: particle1.group,
    id: generateParticleId('merged')
  }
}

const createBurstParticles = (particle: Particle): Particle[] => {
  const burstCount = Math.floor(particle.size * 2)
  const particles: Particle[] = []

  for (let i = 0; i < burstCount; i++) {
    const angle = (Math.PI * 2 * i) / burstCount
    const speed = particle.size * 0.5

    particles.push({
      x: particle.x,
      y: particle.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.max(particle.size * 0.3, 0.5),
      opacity: particle.opacity,
      hue: particle.hue,
      group: particle.group,
      id: generateParticleId('burst')
    })
  }

  return particles
}

const updateParticlePosition = (particle: Particle, canvasWidth: number, canvasHeight: number): void => {
  particle.x += particle.vx
  particle.y += particle.vy

  // 화면 경계 처리 (순환)
  if (particle.x < 0) particle.x = canvasWidth
  if (particle.x > canvasWidth) particle.x = 0
  if (particle.y < 0) particle.y = canvasHeight
  if (particle.y > canvasHeight) particle.y = 0
}

const shouldMergeParticles = (particle1: Particle, particle2: Particle, distance: number): boolean => {
  return distance < particle1.size + particle2.size &&
         particle1.group === particle2.group &&
         particle1.size < MAX_MERGE_SIZE &&
         particle2.size < MAX_MERGE_SIZE
}

const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle): void => {
  ctx.beginPath()
  ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
  ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`
  ctx.fill()
}

const drawConnection = (ctx: CanvasRenderingContext2D, particle1: Particle, particle2: Particle): void => {
  const dx = particle1.x - particle2.x
  const dy = particle1.y - particle2.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance < CONNECTION_DISTANCE) {
    ctx.beginPath()
    ctx.moveTo(particle1.x, particle1.y)
    ctx.lineTo(particle2.x, particle2.y)
    ctx.strokeStyle = `hsla(${particle1.hue}, 50%, 50%, ${CONNECTION_OPACITY_BASE * (1 - distance / CONNECTION_DISTANCE)})`
    ctx.lineWidth = 0.5
    ctx.stroke()
  }
}

const handleParticleClick = (
  particles: Particle[],
  clickX: number,
  clickY: number
): { toRemove: string[], toAdd: Particle[] } => {
  const toRemove: string[] = []
  const toAdd: Particle[] = []

  particles.forEach((particle) => {
    const distance = Math.sqrt(
      Math.pow(particle.x - clickX, 2) + Math.pow(particle.y - clickY, 2)
    )

    if (distance < particle.size * CLICK_RADIUS_MULTIPLIER + CLICK_RADIUS_BASE) {
      toRemove.push(particle.id)
      toAdd.push(...createBurstParticles(particle))
    }
  })

  return { toRemove, toAdd }
}

export const useBackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const { backgroundAnimation, accessibilitySettings } = useAppStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 초기 먼지 생성 함수
    const createInitialParticles = (): void => {
      const particleCount = backgroundAnimation.intensity === 'low' ? 30 :
                           backgroundAnimation.intensity === 'medium' ? 50 : 80

      particlesRef.current = Array.from({ length: particleCount }, () =>
        createParticle(canvas.width, canvas.height)
      )
    }

    // 캔버스 크기 조정 함수
    const resizeCanvas = (): void => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    // 접근성 모드용 최소 애니메이션
    const renderAccessibilityMode = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach(particle => drawParticle(ctx, particle))
    }

    // 메인 애니메이션 함수
    const animate = (): void => {
      if (accessibilitySettings.reducedMotion) {
        renderAccessibilityMode()
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 화면이 가득찰 때까지 먼지 생성
      if (particlesRef.current.length < MAX_PARTICLES) {
        particlesRef.current.push(createParticle(canvas.width, canvas.height))
      }

      // 충돌 감지 및 먼지 업데이트
      const particlesToRemove: string[] = []
      const particlesToAdd: Particle[] = []

      particlesRef.current.forEach((particle, index) => {
        // 위치 업데이트
        updateParticlePosition(particle, canvas.width, canvas.height)

        // 다른 먼지들과 충돌 감지
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index === otherIndex || particlesToRemove.includes(particle.id) || particlesToRemove.includes(otherParticle.id)) {
            return
          }

          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (shouldMergeParticles(particle, otherParticle, distance)) {
            particlesToRemove.push(particle.id, otherParticle.id)
            particlesToAdd.push(createMergedParticle(particle, otherParticle))
          }
        })

        // 먼지 그리기
        drawParticle(ctx, particle)

        // 연결선 그리기 (고강도 모드에서만)
        if (backgroundAnimation.intensity === 'high') {
          particlesRef.current.forEach(otherParticle => {
            if (particle.id !== otherParticle.id) {
              drawConnection(ctx, particle, otherParticle)
            }
          })
        }
      })

      // 먼지 제거 및 추가 처리
      if (particlesToRemove.length > 0) {
        particlesRef.current = particlesRef.current.filter(p => !particlesToRemove.includes(p.id))
        particlesRef.current.push(...particlesToAdd)
      }

      if (backgroundAnimation.type === 'particles') {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // 클릭 이벤트 핸들러
    const handleClick = (event: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect()
      const clickX = event.clientX - rect.left
      const clickY = event.clientY - rect.top

      const { toRemove, toAdd } = handleParticleClick(particlesRef.current, clickX, clickY)

      if (toRemove.length > 0) {
        particlesRef.current = particlesRef.current.filter(p => !toRemove.includes(p.id))
        particlesRef.current.push(...toAdd)
      }
    }

    // 터치 이벤트 핸들러
    const handleTouch = (event: TouchEvent): void => {
      event.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const touch = event.touches[0] || event.changedTouches[0]
      const touchX = touch.clientX - rect.left
      const touchY = touch.clientY - rect.top

      const mouseEvent = new MouseEvent('click', {
        clientX: touchX + rect.left,
        clientY: touchY + rect.top
      })
      handleClick(mouseEvent)
    }

    // 리사이즈 이벤트 핸들러
    const handleResize = (): void => {
      resizeCanvas()
      particlesRef.current.forEach(particle => {
        particle.x = Math.max(0, Math.min(particle.x, canvas.width))
        particle.y = Math.max(0, Math.min(particle.y, canvas.height))
      })
    }

    // 이벤트 리스너 등록 및 초기 설정
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('touchstart', handleTouch, { passive: false })
    window.addEventListener('resize', handleResize)

    resizeCanvas()
    createInitialParticles()
    animate()

    // 정리 함수 반환
    return () => {
      if (canvas) {
        canvas.removeEventListener('click', handleClick)
        canvas.removeEventListener('touchstart', handleTouch)
      }
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [backgroundAnimation, accessibilitySettings.reducedMotion])

  return canvasRef
}
