import { useEffect } from 'react'

/**
 * Hook para detectar scroll hacia arriba en el tope de la página y ejecutar una acción
 * @param {Object} lenisRef - Referencia al componente ReactLenis
 * @param {boolean} isActive - Indica si el detector debe estar activo
 * @param {Function} onScrollUp - Función a ejecutar cuando se hace scroll hacia arriba en el tope
 */
export function useScrollToHero(lenisRef, isActive, onScrollUp) {
  useEffect(() => {
    if (!isActive || !onScrollUp) return

    const handleWheel = (e) => {
      const lenis = lenisRef.current?.lenis
      if (!lenis) return

      // Si estamos en el tope y scrolleamos hacia arriba
      if (lenis.scroll === 0 && e.deltaY < 0) {
        // Prevenir el scroll de Lenis
        e.preventDefault()
        e.stopPropagation()
        
        // Ejecutar la acción
        onScrollUp()
      }
    }

    // Agregar listener con capture para interceptar antes que Lenis
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true })

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true })
    }
  }, [isActive, onScrollUp, lenisRef])
}
