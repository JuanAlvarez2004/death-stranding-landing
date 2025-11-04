import { useRef, useCallback, useState } from "react"
import CanvasModel from "./components/CanvasModel"
import Hero from "./sections/Hero"
import Main from "./sections/Main"
import { ReactLenis } from 'lenis/react'
import { useSectionTransition } from "./hooks/useSectionTransition"
import { useLenisScroll } from "./hooks/useLenisScroll"
import { useScrollToHero } from "./hooks/useScrollToHero"
import { useAudio } from "./hooks/useAudio"
import gsap from "gsap"
import inSound from "/sounds/in-sound.m4a"
import outSound from "/sounds/out-sound.m4a"


function App() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [showMain, setShowMain] = useState(false)
  const modelRef = useRef(null)
  const heroRef = useRef(null)
  const mainRef = useRef(null)
  const lenisRef = useRef(null)
  const canvasContainerRef = useRef(null)

  // Hook para manejar el audio de transición
  const { play: playTransitionSoundIn, isMuted: isMutedIn, toggleMute: toggleMuteIn } = useAudio(inSound, 0.5)
  const { play: playTransitionSoundOut, toggleMute: toggleMuteOut } = useAudio(outSound, 0.5)

  // Callback optimizado que se ejecuta cuando el modelo está listo
  const handleModelReady = useCallback((modelGroup) => {
    if (modelGroup && !modelRef.current) {
      modelRef.current = modelGroup
    }
    setModelLoaded(true)
  }, [])

  // Callback para animar el modelo 3D durante las transiciones
  const handleTransitionStart = useCallback((forward) => {
    if (modelRef.current) {
      // Reproducir el sonido
      if (forward) {
        playTransitionSoundIn()
      } else {
        playTransitionSoundOut()
      }

      // Animar rotación del modelo
      gsap.to(modelRef.current.rotation, {
        y: modelRef.current.rotation.y + (forward ? -Math.PI / 6 : Math.PI / 6),
        duration: 1.25,
        ease: "power1.inOut",
        onStart: () => {
          let zIndex = forward ? '0' : '10'
          let timeOut = forward ? 700 : 500
          if (canvasContainerRef.current) {
            setTimeout(() => {
              canvasContainerRef.current.style.zIndex = zIndex
            }, timeOut);
          }
        }
      })
      // [25, -6, -25]
      gsap.to(modelRef.current.position, {
        x: forward ? 25 : 0,
        y: forward ? -6 : 0,
        z: forward ? -25 : -80,
        duration: 1.25,
        ease: "power1.inOut",
      })
    }
  }, [playTransitionSoundIn, playTransitionSoundOut])

  // Hook para manejar las transiciones entre Hero y Main
  const { gotoHero } = useSectionTransition({
    heroRef,
    mainRef,
    showMain,
    setShowMain,
    isReady: modelLoaded,
    onTransitionStart: handleTransitionStart
  })

  // Hook para integrar Lenis con GSAP
  useLenisScroll(lenisRef, showMain)

  // Hook para detectar scroll hacia arriba en el tope y volver a Hero
  useScrollToHero(lenisRef, showMain, gotoHero)

  // Función para alternar mute/unmute de todos los audios
  const handleToggleMute = useCallback(() => {
    toggleMuteIn()
    toggleMuteOut()
  }, [toggleMuteIn, toggleMuteOut])

  return (
    <>
      {!modelLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-6 w-full max-w-md px-8">
            <div className="text-white font-secundary text-xs md:text-xl">Setting your package...</div>
          </div>
        </div>
      )}

      {/* Canvas con modelo 3D */}
      <CanvasModel ref={modelRef} containerRef={canvasContainerRef} onModelReady={handleModelReady} />

      {/* Hero Section - Siempre presente pero puede estar oculta */}
      <div ref={heroRef} className="fixed inset-0">
        <Hero isReady={modelLoaded} />
      </div>

      <button 
        onClick={handleToggleMute}
        className='fixed bottom-10 left-10 z-20 text-white/60 border rounded-full p-1 cursor-pointer hover:text-white hover:border-white transition pointer-events-auto'
        aria-label={isMutedIn ? "Activar sonido" : "Desactivar sonido"}
      >
        {isMutedIn ? (
          // Icono de volumen muteado (X)
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
            <line x1="22" x2="16" y1="9" y2="15"/>
            <line x1="16" x2="22" y1="9" y2="15"/>
          </svg>
        ) : (
          // Icono de volumen activo (ondas)
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
            <path d="M15.5 8.5a5 5 0 0 1 0 7"/>
            <path d="M18 5a9 9 0 0 1 0 14"/>
          </svg>
        )}
      </button>

      {/* Main Section - Con scroll normal después de la transición */}
      <div ref={mainRef} className={showMain ? "relative" : "fixed inset-0"}>
        <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
          <Main />
        </ReactLenis>
      </div>
    </>
  )
}

export default App
