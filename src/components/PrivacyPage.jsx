import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'
import SEO from './SEO'

const BG = '#004F26'
const ACCENT = '#1AE17A'
const TEXT = '#EFEEE9'
const TEXT_DIM = 'rgba(239, 238, 233, 0.70)'

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: BG, display: 'flex', flexDirection: 'column' }}>
      <SEO title="Privatlivspolitik" description="Læs Mavros privatlivspolitik — vi indsamler ingen persondata og bruger ingen tracking-cookies." path="/privatlivspolitik" />
      <style>{`.mavro-header-sub { padding: 32px 80px; } @media (max-width: 768px) { .mavro-header-sub { padding: 20px 16px; } }`}</style>

      <header className="mavro-header-sub" style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" aria-label="Gå til forsiden"><Logo height={79} /></Link>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', width: '100%', padding: '48px 24px 80px' }}>
        <h1 style={{ color: TEXT, fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: '100%', letterSpacing: 0, margin: '0 0 48px 0' }}>
          Privatlivspolitik
        </h1>

        <Section title="Hvem er vi?">
          <p>Mavro er en digital tjeneste, der hjælper dig med at konvertere opskrifter til glutenfri og/eller laktosefri versioner.</p>
          <p style={{ marginTop: '12px' }}>Kontakt: <a href="mailto:hej@mavro.dk" style={{ color: ACCENT }}>hej@mavro.dk</a></p>
        </Section>

        <Section title="Hvad indsamler vi?">
          <p>Vi indsamler <strong style={{ color: TEXT }}>ingen persondata</strong> om dig som bruger. Du behøver ikke oprette en konto eller angive din e-mail for at bruge tjenesten.</p>
          <p style={{ marginTop: '12px' }}>Vi bruger <strong style={{ color: TEXT }}>Vercel Analytics</strong> til anonymiseret trafikstatistik (antal besøgende, hvilke sider der besøges, land og enhedstype). Vercel Analytics sætter <strong style={{ color: TEXT }}>ingen cookies</strong> og indsamler ingen personhenførbare oplysninger.</p>
        </Section>

        <Section title="Cookies">
          <p>Mavro bruger <strong style={{ color: TEXT }}>ingen tracking-cookies</strong>. Vi bruger hverken Google Analytics, Meta Pixel eller lignende tjenester, der kræver dit samtykke.</p>
          <p style={{ marginTop: '12px' }}>Din browser kan gemme lokale data (localStorage) på din enhed for at huske dine gemte opskrifter. Disse data forlader aldrig din enhed og sendes ikke til os.</p>
        </Section>

        <Section title="Opskrifter du konverterer">
          <p>Når du konverterer en opskrift, sendes teksten eller URL'en til vores server, som videresender den til Anthropic (AI-tjeneste) for at generere konverteringen. Vi gemmer ikke indholdet af dine opskrifter.</p>
          <p style={{ marginTop: '12px' }}>Anthropics privatlivspolitik kan læses på <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>anthropic.com/privacy</a>.</p>
        </Section>

        <Section title="Dine rettigheder">
          <p>Da vi ikke behandler persondata om dig, er der ikke noget at anmode om indsigt i, berigtigelse af eller sletning af. Har du spørgsmål, er du altid velkommen til at skrive til <a href="mailto:hej@mavro.dk" style={{ color: ACCENT }}>hej@mavro.dk</a>.</p>
        </Section>

        <Section title="Ændringer til denne politik">
          <p>Vi opdaterer denne side, hvis der sker ændringer i, hvordan vi behandler data. Dato for seneste opdatering: marts 2025.</p>
        </Section>
      </main>

      <Footer />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ color: TEXT, fontSize: '22px', fontWeight: 700, letterSpacing: 0, margin: '0 0 12px 0' }}>{title}</h2>
      <div style={{ color: TEXT_DIM, fontSize: '16px', lineHeight: '26px' }}>{children}</div>
    </div>
  )
}
