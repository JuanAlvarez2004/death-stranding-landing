import { useRef, useEffect, useState, useCallback } from 'react'

/**
 * Hook para manejar la reproducción de audio
 * @param {string} audioSrc - Ruta del archivo de audio
 * @param {number} volume - Volumen del audio (0.0 a 1.0)
 * @returns {Object} - Función play, isMuted y toggleMute
 */
export function useAudio(audioSrc, volume = 0.5) {
  const audioRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const volumeRef = useRef(volume)

  // Inicializar audio
  useEffect(() => {
    audioRef.current = new Audio(audioSrc)
    audioRef.current.volume = 0 // Iniciar muteado
    audioRef.current.preload = 'auto'
    volumeRef.current = volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioSrc, volume])

  // Función para reproducir el audio
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(err => {
        console.warn('Error to play audio:', err)
      })
    }
  }, [])

  // Función para alternar mute/unmute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMutedState = !isMuted
      audioRef.current.volume = newMutedState ? 0 : volumeRef.current
      setIsMuted(newMutedState)
    }
  }, [isMuted])

  return { play, isMuted, toggleMute }
}
