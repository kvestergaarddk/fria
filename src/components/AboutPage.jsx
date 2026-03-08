import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EEDDB6' }}>
      <header className="pt-10 pb-4 flex flex-col items-center relative px-4">
        <Link to="/" className="absolute left-4 md:left-8 top-10 text-sm font-semibold flex items-center gap-1.5 focus-visible:outline-none rounded"
          style={{ color: '#315E4A' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M13 8H3M7 4L3 8l4 4"/>
          </svg>
          Tilbage
        </Link>
        <Logo />
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 md:px-8 pb-8">
        <h1
          className="mt-8 font-extrabold leading-tight text-center mb-3"
          style={{ color: '#1B3A28', letterSpacing: '-0.02em', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
        >
          Hvad har du lyst til at lave i aften?
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: '#315E4A' }}>
          God mad. Ingen kompromiser.
        </p>

        {/* Hero */}
        <div className="rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: '16/7' }}>
          <img
            src="/forside-billede.jpg"
            alt="Mad på bordet"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tekst */}
        <div className="max-w-2xl space-y-5 text-sm leading-relaxed" style={{ color: '#1A2D1F' }}>
          <p>
            Mavro er skabt til alle dem, der gerne vil lave god mad — men ikke kan spise hvad som helst.
            Vi tror på, at glutenintolerans og laktoseintolerans ikke skal stå i vejen for lækker og
            næringsrig mad.
          </p>
          <p>
            Her finder du opskrifter, der er omhyggeligt filtreret, så du aldrig behøver at bekymre dig
            om ingredienserne. Vælg din intolerans, vælg din måltidstype, og lav mad du faktisk kan spise.
          </p>
          <p>
            God mad. Ingen kompromiser.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
