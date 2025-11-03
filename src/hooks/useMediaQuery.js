import { useState, useEffect } from 'react'

export const useMediaQuery = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    // Inicialización con el valor actual del viewport
    if (typeof window !== 'undefined') {
      return window.innerWidth <= breakpoint
    }
    return false
  })

  useEffect(() => {
    // Función que actualiza el estado cuando cambia el tamaño de la ventana
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint)
    }

    // Agregar el event listener
    window.addEventListener('resize', handleResize)

    // Llamar una vez para asegurar el valor correcto
    handleResize()

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [breakpoint])

  return isMobile
}

export default useMediaQuery
