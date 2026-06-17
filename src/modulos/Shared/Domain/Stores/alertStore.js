// src/stores/alertStore.ts
import { defineStore } from 'pinia'
import { reactive } from 'vue'

let idCounter = 0

export const useAlertStore = defineStore('alert', () => {
  const state = reactive({
    alerts: []
  })

  function addAlert(
    message,
    type = 'info',
    duration = 4000,
    width = 450,
    progressColor = 'white'
  ) {
    const id = ++idCounter
    const alert = reactive({
      id,
      message,
      type,
      duration,
      width,
      progressColor,
      progress: 100
    })

    state.alerts.push(alert)

    if (duration > 0) {
      const intervalTime = 50
      const steps = duration / intervalTime
      let step = 0

      const interval = setInterval(() => {
        step++
        alert.progress = Math.max(0, 100 - (step / steps) * 100)

        if (step >= steps) {
          clearInterval(interval)
          removeAlert(id)
        }
      }, intervalTime)
    }
  }

  function removeAlert(id) {
    const index = state.alerts.findIndex(alert => alert.id === id)
    if (index !== -1) {
      state.alerts.splice(index, 1)
    }
  }

  return {
    alerts: state.alerts,
    addAlert,
    removeAlert
  }
})
