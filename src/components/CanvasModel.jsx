import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment, useProgress } from "@react-three/drei";
import { forwardRef, useEffect } from "react";

// Componente interno que monitorea el progreso de carga
function SceneContent({ modelRef, onModelReady, onProgress }) {
  const { progress, active } = useProgress()

  useEffect(() => {
    // Reportar progreso en tiempo real
    if (onProgress) {
      onProgress(progress)
    }
  }, [progress, onProgress])

  useEffect(() => {
    // Cuando active es false, significa que todos los assets terminaron de cargar
    if (!active && progress === 100 && modelRef?.current && onModelReady) {
      // Pequeño delay para asegurar que todo esté renderizado en el DOM
      const timer = setTimeout(() => {
        onModelReady(modelRef.current)
      }, 50)
      
      return () => clearTimeout(timer)
    }
  }, [active, progress, modelRef, onModelReady])

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

const CanvasModel = forwardRef(({ onModelReady, onProgress }, ref) => {
  return (
    <div className='fixed w-full h-dvh -z-10 pointer-events-none' >
      <Canvas
        dpr={[1, 2]}
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
        <SceneContent modelRef={ref} onModelReady={onModelReady} onProgress={onProgress} />
      </Canvas>
    </div>
  )
})

CanvasModel.displayName = 'CanvasModel'

export default CanvasModel

