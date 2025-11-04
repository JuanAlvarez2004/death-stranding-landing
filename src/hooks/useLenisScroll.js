import { useEffect } from 'react'
import gsap from 'gsap'

/**
 * Hook para integrar Lenis con GSAP ticker
 * @param {Object} lenisRef - Referencia al componente ReactLenis
 * @param {boolean} isActive - Indica si Lenis debe estar activo
 */
export function useLenisScroll(lenisRef, isActive) {
  useEffect(() => {
    if (!isActive) return

    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [isActive, lenisRef])
}
