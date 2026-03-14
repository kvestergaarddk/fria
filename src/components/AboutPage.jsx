import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'
import SEO from './SEO'

const BG = '#004F26'
const TEXT = '#EFEEE9'
const TEXT_DIM = 'rgba(239, 238, 233, 0.70)'
const DIVIDER = 'rgba(239, 238, 233, 0.12)'

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', flexDirection: 'column' }}>
      <SEO title="Om Mavro" description="Mød holdet bag Mavro — tjenesten der konverterer opskrifter til glutenfri og laktosefri versioner." path="/om-mavro" />
      <style>{`.mavro-header-sub { padding: 32px 80px; } @media (max-width: 768px) { .mavro-header-sub { padding: 20px 16px; } }`}</style>

      <header className="mavro-header-sub" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" aria-label="Gå til forsiden"><Logo height={79} /></Link>
      </header>

      <main className="flex-1 max-w-[760px] mx-auto w-full px-6 md:px-10 pb-20">

        <h1 style={{
          color: TEXT,
          fontWeight: 800,
          fontSize: 'clamp(2.8rem, 7vw, 80px)',
          lineHeight: 1,
          marginTop: '60px',
          marginBottom: '40px',
          letterSpacing: 0,
        }}>
          Om Mavro
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: TEXT_DIM, fontSize: '20px', lineHeight: '32px' }}>
            Mavro opstod ud af en meget konkret familiesituation. Pludselig stod vi med én i familien,
            der ikke kan tåle gluten — det skaber inflammation i hans led og giver smerter. Og en anden,
            der har fået konstateret laktoseintolerans. Hverdagsmaden, som vi altid bare havde lavet,
            skulle tænkes helt om.
          </p>
          <p style={{ color: TEXT_DIM, fontSize: '20px', lineHeight: '32px' }}>
            Det lyder måske ikke af så meget — men det er det. Hvad må man spise? Hvad indeholder hvad?
            Hvad sker der egentlig i kroppen, når den reagerer? Og ikke mindst: hvordan laver man stadig
            mad, der smager af noget, når man ikke kan bruge halvdelen af det, man plejer?
          </p>
          <p style={{ color: TEXT_DIM, fontSize: '20px', lineHeight: '32px' }}>
            I en travl hverdag savnede jeg ét sted, jeg kunne gå hen — et sted der samler opskrifter,
            viden og svar, uden at man skal rode rundt på tværs af hundrede hjemmesider. Det er Mavro.
          </p>
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px', fontWeight: 700 }}>
            God mad. For alle. Uden kompromiser.
          </p>
        </div>

        <div style={{ height: '1px', backgroundColor: DIVIDER, margin: '60px 0' }} />

        <p style={{ color: TEXT_DIM, fontSize: '16px', lineHeight: '24px' }}>
          Har du spørgsmål? Se vores{' '}
          <Link to="/faq" style={{ color: TEXT, fontWeight: 600, textDecoration: 'underline' }}>FAQ</Link>
          {' '}eller skriv til os på{' '}
          <a href="mailto:hej@mavro.dk" style={{ color: TEXT, fontWeight: 600, textDecoration: 'underline' }}>hej@mavro.dk</a>.
        </p>

      </main>

      <Footer />
    </div>
  )
}
