export interface AppState {
  theme: 'light' | 'dark'
  isPlaying: boolean
  volume: number
}

export interface BackgroundAnimation {
  type: 'particles' | 'waves' | 'gradient'
  intensity: 'low' | 'medium' | 'high'
}

export interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
}
