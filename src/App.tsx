import React from 'react'
import { motion } from 'framer-motion'
import { useBackgroundAnimation } from '@/hooks/useBackgroundAnimation'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAppStore } from '@/lib/store'

const App: React.FC = () => {
  const canvasRef = useBackgroundAnimation()
  const { theme } = useAppStore()

  return (
    <div className={`app ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Background Canvas */}
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="background-canvas"
          aria-hidden="true"
        />
      </div>

      {/* Main Content */}
      <main className="main-content" role="main">
        <motion.div
          className="overlay-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="app-title"
            tabIndex={0}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            멍때리기
          </motion.h1>

          <motion.p
            className="app-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            마음을 편안하게 하는 공간입니다.
            <br />
            여유롭게 호흡하며 이 순간에 집중해보세요.
          </motion.p>

          {/* Theme Toggle */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <ThemeToggle />
          </motion.div>

          {/* Accessibility Instructions */}
          <motion.div
            className="instructions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <p className="accessibility-note">
              키보드 사용자는 Tab 키로 제목에 포커스를 이동할 수 있습니다.
              <br />
              움직임에 민감한 사용자를 위해 애니메이션을 최소화했습니다.
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Screen reader only text for context */}
      <div className="sr-only">
        <h2>멍때리기 명상 앱</h2>
        <p>
          이 애플리케이션은 사용자가 편안하게 명상에 집중할 수 있도록
          설계된 시각적 공간을 제공합니다. 배경은 부드럽게 변화하며
          마음의 평안을 돕습니다.
        </p>
      </div>
    </div>
  )
}

export default App
