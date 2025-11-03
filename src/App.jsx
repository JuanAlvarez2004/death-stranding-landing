import { useRef, useEffect, useCallback, useState } from "react"
import CanvasModel from "./components/CanvasModel"
import Hero from "./sections/Hero"
import Main from "./sections/Main"
import gsap from "gsap"
import { ReactLenis } from 'lenis/react'

function App() {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const modelRef = useRef(null)
  const lenisRef = useRef()

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)

    return () => gsap.ticker.remove(update)
  }, [])

  // Callback optimizado que se ejecuta cuando el modelo está listo
  const handleModelReady = useCallback((modelGroup) => {
    // Asegurar que el ref esté correctamente asignado
    if (modelGroup && !modelRef.current) {
      modelRef.current = modelGroup
    }

    // Set state para trigger useGSAP
    setModelLoaded(true)
  }, []) // Sin dependencias ya que solo cambia el estado

  // Callback para actualizar el progreso de carga
  const handleLoadingProgress = useCallback((progress) => {
    setLoadingProgress(progress)
  }, [])

  return (
    <div className="flex flex-col h-full w-full overflow-x-clip">
      
      {!modelLoaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-6 w-full max-w-md px-8">
            <div className="text-white font-secundary text-xs md:text-xl">Setting your package...</div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-white/20 rounded-full h-2 md:h-3 overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            
            {/* Porcentaje */}
            <div className="text-white/70 font-secundary text-xs md:text-base">
              {Math.round(loadingProgress)}%
            </div>
          </div>
        </div>
      )}

      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      <CanvasModel ref={modelRef} onModelReady={handleModelReady} onProgress={handleLoadingProgress} />
      <Hero />
      <Main />
    </div>
  )
}

export default App
