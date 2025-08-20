// Utility functions for dynamic time calculation

export interface ActivityTimeConfig {
  video: number
  artigo: number
  conteudo: number
  multipla: number
  default: number
}

// Base time estimates per activity type (in minutes)
export const ACTIVITY_TIME_CONFIG: ActivityTimeConfig = {
  video: 5, // Videos tend to be longer
  artigo: 4, // Articles require reading and following steps
  conteudo: 3, // Content is usually shorter
  multipla: 6, // Multiple options require more decision time
  default: 4, // Default fallback
}

// Maximum recommended time per module (in minutes)
export const MAX_MODULE_TIME = 120

export interface ActivityData {
  numero: number
  titulo: string
  descricao: string
  tempo: number
  tipo?: "video" | "artigo" | "conteudo" | "multipla"
  url?: string
  opcoes?: any[]
}

/**
 * Calculate dynamic time for a single activity
 */
export function calculateActivityTime(activity: ActivityData): number {
  // Ensure activity is valid
  if (!activity || typeof activity !== "object") {
    return 0
  }

  // If activity has explicit time, use it (ensure it's a number)
  if (activity.tempo && typeof activity.tempo === "number" && activity.tempo > 0) {
    return Math.round(activity.tempo)
  }

  // Otherwise, calculate based on type
  const activityType = activity.tipo || "default"
  const baseTime = ACTIVITY_TIME_CONFIG[activityType] || ACTIVITY_TIME_CONFIG.default

  // Adjust for multiple options
  if (activity.tipo === "multipla" && Array.isArray(activity.opcoes)) {
    return Math.round(baseTime + activity.opcoes.length * 1) // Add 1 min per option
  }

  return Math.round(baseTime)
}

/**
 * Calculate total time for a module based on its activities
 */
export function calculateModuleTime(activities: ActivityData[]): number {
  if (!Array.isArray(activities) || activities.length === 0) {
    return 0
  }

  try {
    const totalTime = activities.reduce((total, activity) => {
      const activityTime = calculateActivityTime(activity)
      return total + (typeof activityTime === "number" ? activityTime : 0)
    }, 0)

    return Math.round(totalTime)
  } catch (error) {
    console.error("Error calculating module time:", error)
    return 0
  }
}

/**
 * Get time estimate with warning if exceeds maximum
 */
export function getModuleTimeWithWarning(activities: ActivityData[]): {
  time: number
  isOverLimit: boolean
  recommendedBreaks: number
} {
  const time = calculateModuleTime(activities)
  const isOverLimit = time > MAX_MODULE_TIME
  const recommendedBreaks = isOverLimit ? Math.ceil(time / 60) - 1 : 0

  return {
    time,
    isOverLimit,
    recommendedBreaks,
  }
}

/**
 * Format time display (e.g., "1h 30min" or "45min")
 */
export function formatModuleTime(minutes: number): string {
  if (!minutes || typeof minutes !== "number" || minutes <= 0) {
    return "0min"
  }

  const totalMinutes = Math.round(minutes)
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  return `${mins}min`
}

/**
 * Get time category for styling purposes
 */
export function getTimeCategory(minutes: number): "short" | "medium" | "long" | "very-long" {
  if (!minutes || typeof minutes !== "number") {
    return "short"
  }

  const totalMinutes = Math.round(minutes)

  if (totalMinutes <= 30) return "short"
  if (totalMinutes <= 60) return "medium"
  if (totalMinutes <= 120) return "long"
  return "very-long"
}
