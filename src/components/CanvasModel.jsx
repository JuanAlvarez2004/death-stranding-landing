import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment, useProgress } from "@react-three/drei";
import { forwardRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useMediaQuery from "../hooks/useMediaQuery";

// Componente interno que monitorea el progreso de carga
function SceneContent({ modelRef, onModelReady }) {
  const { active } = useProgress()

  useEffect(() => {
    // Cuando active es false, significa que todos los assets terminaron de cargar
    if (!active && modelRef?.current && onModelReady) {
      // Pequeño delay para asegurar que todo esté renderizado en el DOM
      const timer = setTimeout(() => {
        onModelReady(modelRef.current)
      }, 50)
      
      return () => clearTimeout(timer)
    }
  }, [active, modelRef, onModelReady])

  useGSAP(() => {
    if (active) return
    gsap.set('#canvas-container', { zIndex: 10 })
    gsap.from(modelRef.current.position, {
      y: -7.5,
      z: -8,
      duration: 3,
      delay: .3,
      ease: "power2.out",
    })
  }, [active, modelRef])

  return (
    <>
      <Environment
        preset="sunset"
        background={false}
      />

      <group
        position={[0, 0, -80]} 
        rotation={[0, -Math.PI / 2, 0]}
        scale={0.1}
        ref={modelRef}
      >
        <Model />
      </group>
    </>
  )
}

const CanvasModel = forwardRef(({ onModelReady, containerRef }, ref) => {
  const isMobile = useMediaQuery()

  return (
    <div id="canvas-container" ref={containerRef} className='fixed w-full h-dvh pointer-events-none' >
      <Canvas
        dpr={isMobile ? [0.5, 1.2] : [1, 2]}
        camera={{
          fov: 75,
        }}
        performance={{ min: 0.5 }}
        frameloop="always"
        gl={{
          alpha: true,
          stencil: false,
          depth: true,
        }}
      >
        <SceneContent modelRef={ref} onModelReady={onModelReady} />
      </Canvas>
    </div>
  )
})

CanvasModel.displayName = 'CanvasModel'

export default CanvasModel

