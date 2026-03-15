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
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px' }}>
            Mavro er skabt for at gøre hverdagen lettere for mennesker, der ikke tåler gluten eller laktose.
          </p>
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px' }}>
            Idéen opstod i vores egen familie. Pludselig stod vi med én, der ikke tåler gluten og får inflammation og smerter i kroppen, og en anden der har laktoseintolerans. Den mad vi altid bare havde lavet, fungerede ikke længere.
          </p>
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px' }}>
            Det lyder måske simpelt at undgå gluten eller laktose. Men i praksis betyder det, at man skal tænke næsten al mad om. Hvad indeholder hvad? Hvad kan man erstatte? Og hvordan laver man stadig mad, der smager godt?
          </p>
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px' }}>
            I en travl hverdag savnede jeg ét sted, hvor det hele var samlet. Et sted med opskrifter, viden og hjælp til at tilpasse almindelige retter, uden at skulle lede på tværs af utallige hjemmesider.
          </p>
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px' }}>
            Det blev starten på Mavro.
          </p>
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px' }}>
            På Mavro finder du opskrifter uden gluten og laktose, og værktøjer der gør det nemmere at tilpasse mad til din hverdag. Du kan blandt andet bruge vores opskriftsværktøj til at omdanne almindelige opskrifter til versioner uden gluten eller laktose.
          </p>
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px' }}>
            Målet er enkelt:<br />
            At gøre det lettere at lave mad, der fungerer for kroppen og stadig smager godt.
          </p>
          <p style={{ color: TEXT, fontSize: '20px', lineHeight: '32px' }}>
            Derfor findes Mavro.<br />
            <span style={{ fontWeight: 700 }}>Mad til glade maver.</span>
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
