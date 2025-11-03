import { useGSAP } from '@gsap/react'
import bgHero from '/bg-hero.webp'
import gsap from 'gsap'

export default function Hero() {

  useGSAP(() => {
    gsap.from('#title', {
      alpha: 0,
      y: -50,
      duration: 1.5,
      ease: 'power3.out',
    })
  })

  return (
    <section className="relative w-full h-dvh overflow-hidden grid place-content-center">
      <div className='absolute inset-0 -z-20'>
        <img className='w-full h-full object-cover contrast-105 ' src={bgHero} alt="Background Hero" />
      </div>
      <div className='-z-20 absolute bottom-0 w-full h-2/3 bg-linear-to-t from-black to-transparent'></div>
      <h1 id='title' className='text-2xl md:text-7xl text-zinc-950 tracking-[1.5rem] md:tracking-[3rem] lg:tracking-[5rem] font-principal flex flex-col items-center justify-center -mr-6'>
        <span className='-z-20'>DEATH</span>
        <span>STRANDING</span>
      </h1>
    </section>
  )

}