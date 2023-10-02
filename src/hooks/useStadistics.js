import { useState, useEffect } from 'react'

export function useStadistics (win, assign) {
  // Conteo de partidas ganadas y jugadas
  const [metrics, setMetrics] = useState({
    plays: 0,
    won: 0,
    loose: 0
  })
  useEffect(() => {
    if (!win || !assign) return // Si no hay ganador o empate no hace nada
    const metric = Object.assign({}, metrics)
    // si hay ganador o empate suma uno a las partidas
    metric.plays = metric.plays + 1
    // Si el usuario ganó, suma uno a las partidas ganadas
    if (win === assign.user) metric.won = metric.won + 1
    // Si el usuario perdió, suma uno al número de partidas perdidas
    if (win === assign.machine) metric.loose = metric.loose + 1
    // Actualiza el estado de las estadisticas
    setMetrics(metric)
  }, [win]) // Se ejecuta cada vez que el ganador cambie

  return metrics
}
