import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { AppState, BackgroundAnimation, AccessibilitySettings } from '@/types/app'

interface AppStore extends AppState {
  backgroundAnimation: BackgroundAnimation
  accessibilitySettings: AccessibilitySettings

  // Actions
  toggleTheme: () => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setBackgroundAnimation: (animation: BackgroundAnimation) => void
  setAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => void
  resetSettings: () => void
}

const defaultBackgroundAnimation: BackgroundAnimation = {
  type: 'particles',
  intensity: 'low',
}

const defaultAccessibilitySettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
}

const initialState: AppState = {
  theme: 'light',
  isPlaying: true,
  volume: 0.3,
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        backgroundAnimation: defaultBackgroundAnimation,
        accessibilitySettings: defaultAccessibilitySettings,

        toggleTheme: () => {
          set((state) => ({
            theme: state.theme === 'light' ? 'dark' : 'light',
          }))
        },

        setIsPlaying: (isPlaying: boolean) => {
          set({ isPlaying })
        },

        setVolume: (volume: number) => {
          set({ volume: Math.max(0, Math.min(1, volume)) })
        },

        setBackgroundAnimation: (backgroundAnimation: BackgroundAnimation) => {
          set({ backgroundAnimation })
        },

        setAccessibilitySettings: (newSettings: Partial<AccessibilitySettings>) => {
          set((state) => ({
            accessibilitySettings: {
              ...state.accessibilitySettings,
              ...newSettings,
            },
          }))
        },

        resetSettings: () => {
          set({
            ...initialState,
            backgroundAnimation: defaultBackgroundAnimation,
            accessibilitySettings: defaultAccessibilitySettings,
          })
        },
      }),
      {
        name: 'spacing-out-app',
        partialize: (state) => ({
          theme: state.theme,
          backgroundAnimation: state.backgroundAnimation,
          accessibilitySettings: state.accessibilitySettings,
          volume: state.volume,
        }),
      }
    ),
    { name: 'AppStore' }
  )
)
