import { useGSAP } from '@gsap/react'
import samImage from '/images/sam.png'
import fragileImage from '/images/fragile.png'
import higgsImage from '/images/higgs.png'
import louImage from '/images/lou.png'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useMediaQuery } from '../hooks/useMediaQuery'


const Card = ({ name, img, index }) => {
  return (
    <div
      className="card absolute flex flex-col border-b-2 border-white h-[70dvh] bg-black/50 backdrop-blur-md text-center overflow-hidden"
      data-index={index}
    >
      <h3 className='flex-1 font-secundary text-3xl'>{name}</h3>
      <img className='h-auto w-auto opacity-65 object-cover drop-shadow-2xl' src={img} alt={name} />
    </div>
  )
}

gsap.registerPlugin(ScrollTrigger)

export default function Main({ onBackToHero, modelRef, showMain, playCardSound }) {
  const isMobile = useMediaQuery(768)
  
  const characters = [
    {
      name: 'Sam Porter',
      img: samImage,
    },
    {
      name: 'Fragile',
      img: fragileImage,
    },
    {
      name: 'Higgs',
      img: higgsImage,
    },
    {
      name: 'Lou',
      img: louImage,
    }
  ]

  useGSAP(() => {
    const cards = gsap.utils.toArray('.card')
    const cardContainer = document.getElementById('card-container')
    
    if (!cardContainer || cards.length === 0) return

    const recSection = cardContainer.getBoundingClientRect()
    
    // Calcular dimensiones según el viewport
    const cardWidth = isMobile 
      ? recSection.width * 0.8 // 80% del ancho en mobile
      : (recSection.width - 60) / cards.length
    
    const cardHeight = isMobile ? recSection.height * 0.5 : recSection.height * 0.7 // 50% o 70% de la altura

    // Establecer el estado inicial de las cartas 
    cards.forEach((card) => {
      gsap.set(card, { 
        width: cardWidth,
        height: 0,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(0px)',
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0
      })
    })

    // Solo crear las animaciones cuando showMain sea true
    if (!showMain) return
    
    // Timeline principal que contiene todas las animaciones secuenciales
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#main',
        start: "top top",
        end: `bottom bottom`,
        scrub: 1,
        markers: false, // Cambiar a true para debug
        invalidateOnRefresh: true,
        fastScrollEnd: true
      }
    })

    cards.forEach((card, index) => {
      // Calcular posición final según el viewport
      let endPositionX, endPositionY
      
      if (isMobile) {
        // Mobile: apilar verticalmente desde arriba
        const verticalSpacing = cardHeight * 0.3 // 30% del alto de la carta como espaciado
        const startY = -(recSection.height / 2) + (cardHeight / 2) + 20 // Comenzar cerca del top
        endPositionX = 0 // Mantener centrado horizontalmente
        endPositionY = startY + (index * verticalSpacing)
      } else {
        // Desktop: apilar horizontalmente de izquierda a derecha
        endPositionX = index * cardWidth - (recSection.width / 2) + (cardWidth / 2) + 30
        endPositionY = 0
      }

      // Agregar la animación de cada carta al timeline principal de forma secuencial
      mainTimeline
        .to(card, {
          height: cardHeight,
          borderColor: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)',
          duration: 1,
          onStart: () => {
            // Reproducir el sonido cuando empieza la animación de esta carta
            playCardSound()
          }
        })
        .to(card, {
          x: endPositionX,
          y: endPositionY,
          scale: 1,
          duration: 1,
        })
    })

    // Animación de rotación del modelo 3D con scroll
    if (modelRef?.current) {
      gsap.to(modelRef.current.rotation, {
        y: modelRef.current.rotation.y + Math.PI * 4, // 2 rotaciones completas (720 grados)
        scrollTrigger: {
          trigger: '#main',
          start: "top top",
          end: "bottom bottom",
          scrub: 2, // scrub más alto = rotación más suave
          markers: false
        }
      })
    }
  }, [showMain, isMobile, playCardSound])

  return (
    <main id='main' className="relative h-[400vh] w-full text-white overflow-clip">
      <button
        onClick={onBackToHero}
        className="absolute top-0 left-1/2 -translate-x-1/2 mt-4 hover:scale-110 transition-transform cursor-pointer z-50"
        aria-label="Volver a Hero"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6" /></svg>
      </button>
      <section id='card-container' className='sticky top-0 h-dvh w-full'>
        {characters.map((character, index) => (
          <Card
            key={character.name}
            name={character.name}
            img={character.img}
            index={index}
          />
        ))}
      </section>
    </main>
  )
}