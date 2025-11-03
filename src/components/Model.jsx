import { useGLTF } from "@react-three/drei"
import { memo, useMemo } from "react"
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js"
import useMediaQuery from '../hooks/useMediaQuery'
import * as THREE from "three"

function Model() {
  const { scene } = useGLTF('/bridge-baby.glb')
  const isMobile = useMediaQuery()
  
  // Clonamos la escena para evitar problemas de instancias múltiples
  const clonedScene = useMemo(() => {
    const cloned = clone(scene)
    
    // Optimizaciones del modelo
    cloned.traverse((child) => {
      if (child.isMesh) {
        // Habilitar frustum culling para mejor performance
        child.frustumCulled = true
        
        // Optimizar materiales si existen
        if (child.material) {
          // En móvil, reducir drásticamente la calidad del material
          if (isMobile) {
            // Cambiar a materiales más simples en móvil
            if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              // Reducir calidad de texturas
              if (child.material.map) {
                child.material.map.minFilter = THREE.LinearFilter
                child.material.map.magFilter = THREE.LinearFilter
                child.material.map.anisotropy = 1
              }
              
              // Simplificar cálculos de materiales
              child.material.roughness = Math.max(child.material.roughness || 0.5, 0.5)
              child.material.metalness = Math.min(child.material.metalness || 0, 0.5)
              
              // Desactivar características costosas
              child.material.envMapIntensity = child.material.envMapIntensity ? child.material.envMapIntensity * 0.5 : 0.5
            }
            
            // Precisión baja en móvil
            child.material.precision = "lowp"
            
            // Desactivar sombras en móvil
            child.castShadow = false
            child.receiveShadow = false
          } else {
            // Configurar niveles de detalle si es necesario en desktop
            child.material.precision = "mediump"
            
            // Configurar shadows de manera más eficiente
            child.castShadow = true
            child.receiveShadow = true
          }
          
          // Deshabilitar actualizaciones innecesarias del material
          child.material.needsUpdate = false
        }
        
        // Simplificar geometrías en móvil si es posible
        if (isMobile && child.geometry) {
          child.geometry.computeBoundingSphere()
          child.geometry.computeBoundingBox()
        }
      }
    })
    
    return cloned
  }, [scene, isMobile])
  
  return <primitive object={clonedScene} dispose={null} />
}

// Memoizar el componente para evitar re-renders innecesarios
export default memo(Model)

// Precargar el modelo con configuraciones optimizadas
useGLTF.preload('/bridge-baby.glb')