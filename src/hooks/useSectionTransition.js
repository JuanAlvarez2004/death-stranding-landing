import { useCallback, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

/**
 * Hook para manejar las transiciones suaves entre Hero y Main
 * @param {Object} refs - Referencias a los elementos hero y main
 * @param {boolean} showMain - Estado que indica si Main está visible
 * @param {Function} setShowMain - Función para cambiar el estado de showMain
 * @param {boolean} isReady - Indica si el componente está listo para animar
 * @param {Function} onTransitionStart - Callback que se ejecuta al iniciar una transición
 * @returns {Object} - Funciones para navegar entre secciones
 */
export function useSectionTransition({ heroRef, mainRef, showMain, setShowMain, isReady, onTransitionStart }) {
  const observerRef = useRef(null)
  const animatingRef = useRef(false)
  const onTransitionStartRef = useRef(onTransitionStart)

  // Mantener actualizada la referencia del callback
  useEffect(() => {
    onTransitionStartRef.current = onTransitionStart
  }, [onTransitionStart])

  // Función para ir a Main
  const gotoMain = useCallback(() => {
    if (animatingRef.current || !heroRef.current || !mainRef.current) return
    
    animatingRef.current = true

    // Ejecutar el callback si existe
    if (onTransitionStartRef.current) {
      onTransitionStartRef.current(true)
    }

    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => {
        animatingRef.current = false
        setShowMain(true)
        // Destruir el observer después de la transición
        if (observerRef.current) {
          observerRef.current.kill()
          observerRef.current = null
        }
        // Asegurar que el scroll esté en el top después de la transición
        window.scrollTo(0, 0)
      }
    })

    // Animar Hero hacia arriba y que desaparezca
    tl.to(heroRef.current, { 
      yPercent: -100,
    })

    // Animar Main desde abajo
    gsap.set(mainRef.current, { 
      yPercent: 100,
      autoAlpha: 1
    })
    
    tl.to(mainRef.current, { 
      yPercent: 0
    }, 0)
  }, [heroRef, mainRef, setShowMain])

  // Función para volver a Hero
  const gotoHero = useCallback(() => {
    if (animatingRef.current || !heroRef.current || !mainRef.current) return
    
    animatingRef.current = true

    // Ejecutar el callback si existe
    if (onTransitionStartRef.current) {
      onTransitionStartRef.current(false)
    }

    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power1.inOut" },
      onComplete: () => {
        animatingRef.current = false
        setShowMain(false)
      }
    })

    // Animar Main hacia abajo
    tl.to(mainRef.current, { 
      yPercent: 100,
    })

    // Animar Hero desde arriba
    gsap.set(heroRef.current, { 
      yPercent: -100,
      autoAlpha: 1
    })
    
    tl.to(heroRef.current, { 
      yPercent: 0
    }, 0)
  }, [heroRef, mainRef, setShowMain])

  // Configurar Observer para la transición Hero -> Main
  useEffect(() => {
    if (!isReady || !heroRef.current || !mainRef.current || showMain) return

    // Crear el Observer solo cuando estamos en Hero
    observerRef.current = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onUp: () => {
        if (!animatingRef.current) {
          gotoMain()
        }
      },
      tolerance: 10,
      preventDefault: true
    })

    // Inicializar las secciones
    gsap.set(heroRef.current, { yPercent: 0, autoAlpha: 1 })
    gsap.set(mainRef.current, { yPercent: 100, autoAlpha: 0 })

    return () => {
      if (observerRef.current) {
        observerRef.current.kill()
        observerRef.current = null
      }
    }
  }, [isReady, showMain, gotoMain, heroRef, mainRef])

  return {
    gotoMain,
    gotoHero
  }
}
