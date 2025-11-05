import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import bgHero from '/images/bg-hero.webp'


export default function Hero({ isReady }) {
  useGSAP(() => {
    if (!isReady) return
    gsap.from('#title', {
      alpha: 0,
      scale: 0.97,
      duration: 1.5,
    })
  }, [isReady])

  return (
    <>
      <div className='fixed inset-0'>
        <img className='w-full h-full object-cover contrast-105' src={bgHero} alt="Background Hero" />
      </div>

      <div className='fixed bottom-0 w-full h-2/3 bg-linear-to-t from-black to-transparent'></div>

      <section className="fixed inset-0 w-full h-dvh grid place-content-center pointer-events-none">
        <h1 id='title' className='mb-30 text-2xl md:text-7xl text-zinc-950 tracking-[1.5rem] md:tracking-[3rem] lg:tracking-[5rem] font-principal flex flex-col items-center justify-center -mr-6 relative'>
          <span>DEATH</span>
          <span>STRANDING</span>
        </h1>
      </section>
    </>
  )

}