"use client"

import { useState, useEffect, useMemo } from "react"

interface TimeData {
  time: number
  formattedTime: string
  isOverLimit: boolean
  recommendedBreaks: number
  category: "short" | "medium" | "long" | "very-long"
}

export const useDynamicTime = (totalActivities = 0, completedActivities = 0, averageTimePerActivity = 5): TimeData => {
  const [currentTime, setCurrentTime] = useState<number>(0)

  // Calcular tempo restante baseado nas atividades
  const remainingActivities = Math.max(0, totalActivities - completedActivities)
  const estimatedTime = remainingActivities * averageTimePerActivity

  useEffect(() => {
    setCurrentTime(estimatedTime)
  }, [estimatedTime])

  const timeData = useMemo((): TimeData => {
    try {
      const time = currentTime
      const hours = Math.floor(time / 60)
      const minutes = time % 60

      let formattedTime = ""
      if (hours > 0) {
        formattedTime = `${hours}h ${minutes}min`
      } else if (minutes > 0) {
        formattedTime = `${minutes}min`
      } else {
        formattedTime = "Concluído"
      }

      const isOverLimit = time > 60
      const recommendedBreaks = Math.floor(time / 30)

      let category: "short" | "medium" | "long" | "very-long" = "short"
      if (time <= 20) category = "short"
      else if (time <= 40) category = "medium"
      else if (time <= 60) category = "long"
      else category = "very-long"

      return {
        time,
        formattedTime,
        isOverLimit,
        recommendedBreaks,
        category,
      }
    } catch (error) {
      console.error("Erro no useDynamicTime:", error)
      return {
        time: 0,
        formattedTime: "0min",
        isOverLimit: false,
        recommendedBreaks: 0,
        category: "short",
      }
    }
  }, [currentTime])

  return timeData
}
