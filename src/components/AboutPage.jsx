import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'

const BG     = '#EEDDB6'
const GREEN  = '#315E4A'
const DARK   = '#1B3A28'
const CHIP   = '#D8C88A'

const FAQ = [
  {
    q: 'Hvad er gluten, og hvad sker der i kroppen?',
    a: 'Gluten er et protein, der findes i hvede, rug, byg og spelt. For nogle mennesker udløser gluten en immunreaktion, der skaber inflammation i kroppen — det kan ramme tarmen, led, hud og meget mere. Det er ikke det samme som cøliaki, men kroppens signal om, at den reagerer negativt på glutenet.',
  },
  {
    q: 'Hvad er laktoseintolerans?',
    a: 'Laktose er sukkerarten i mælk. Kroppen bruger enzymet laktase til at nedbryde den. Har man laktoseintolerans, producerer man for lidt laktase, og ufordøjet laktose giver mavesmerter, oppustethed og andre symptomer. Det er ikke en allergi, men en intolerans — og graden varierer fra person til person.',
  },
  {
    q: 'Kan man godt have begge intoleranser?',
    a: 'Ja, det er faktisk ikke ualmindeligt. Kroppen reagerer på det den reagerer på, og de to ting er uafhængige af hinanden. Mange familier oplever, at der er flere intoleranser på spil på samme tid — og det er netop det, der gør madlavningen ekstra udfordrende.',
  },
  {
    q: 'Hvad er forskellen på glutenintolerans og cøliaki?',
    a: 'Cøliaki er en autoimmun sygdom, hvor gluten skader tarmvæggen og kan føre til alvorlige langtidsskader. Det diagnosticeres via blodprøver og tyndtarmsbiopsi. Glutenintolerans (ikke-cøliakisk glutensensitivitet) giver mange af de samme symptomer, men uden den autoimmune skade. Begge kræver glutenfri kost.',
  },
  {
    q: 'Hvilke ingredienser skal jeg undgå ved glutenintolerans?',
    a: 'Undgå alt med hvede, rug, byg og spelt — det inkluderer almindeligt mel, pasta, brød, øl og mange færdigretter. Gode alternativer er rismel, mandelmel, majsmel, majsstivelse, kartoffelstivelse og glutenfri havregryn (mærket glutenfri).',
  },
  {
    q: 'Hvad erstatter jeg mælk og fløde med?',
    a: 'Der er mange gode alternativer: havremælk er god til madlavning og bagning, kokosmælk passer godt til saucer og curry, mandelmælk er mild i smagen. Til stegning og bagning kan kokosolie eller laktosefri smør bruges. De fleste supermarkeder har et bredt udvalg af laktosefrie mejeriprodukter.',
  },
  {
    q: 'Er opskrifterne på Mavro testet?',
    a: 'Opskrifterne er omhyggeligt gennemgået for at sikre, at de overholder de angivne diæter. Vi anbefaler altid at tjekke emballage på de produkter du køber, da indhold og mærkning kan variere mellem mærker.',
  },
  {
    q: 'Kan børn også have gluten- og laktoseintolerans?',
    a: 'Ja. Det kan opstå i alle aldre — også hos børn. Mange forældre opdager det, fordi barnet har mavesmerter, dårlig trivsel eller ondt i led og muskler. Er du i tvivl, er første skridt altid en samtale med din læge.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: `1.5px solid ${CHIP}`,
        paddingBottom: open ? '20px' : '0',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left flex items-start justify-between gap-4 focus-visible:outline-none"
        style={{ padding: '20px 0', cursor: 'pointer', background: 'none', border: 'none' }}
      >
        <span style={{ color: DARK, fontWeight: 700, fontSize: '18px', lineHeight: 1.3 }}>
          {q}
        </span>
        <span
          style={{
            color: GREEN,
            fontSize: '24px',
            lineHeight: 1,
            flexShrink: 0,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'inline-block',
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? '400px' : '0',
          opacity: open ? 1 : 0,
          transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
        }}
      >
        <p style={{ color: GREEN, fontSize: '16px', lineHeight: 1.75, paddingBottom: '4px' }}>
          {a}
        </p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>

      <header className="pt-10 pb-4 flex flex-col items-center relative px-4">
        <Link
          to="/"
          className="absolute left-4 md:left-8 top-10 text-sm font-semibold flex items-center gap-1.5 focus-visible:outline-none rounded"
          style={{ color: GREEN }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M13 8H3M7 4L3 8l4 4"/>
          </svg>
          Tilbage
        </Link>
        <Logo color={GREEN} />
      </header>

      <main className="flex-1 max-w-[760px] mx-auto w-full px-4 md:px-8 pb-20">

        {/* ── Om Mavro ─────────────────────────────────────────── */}
        <h1
          style={{
            color: GREEN,
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 80px)',
            lineHeight: 1,
            marginTop: '60px',
            marginBottom: '40px',
            letterSpacing: '-0.02em',
          }}
        >
          Om Mavro
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ color: DARK, fontSize: '18px', lineHeight: 1.75 }}>
            Mavro opstod ud af en meget konkret familiesituation. Pludselig stod vi med én i familien,
            der ikke kan tåle gluten — det skaber inflammation i hans led og giver smerter. Og en anden,
            der har fået konstateret laktoseintolerans. Hverdagsmaden, som vi altid bare havde lavet,
            skulle tænkes helt om.
          </p>
          <p style={{ color: DARK, fontSize: '18px', lineHeight: 1.75 }}>
            Det lyder måske ikke af så meget — men det er det. Hvad må man spise? Hvad indeholder hvad?
            Hvad sker der egentlig i kroppen, når den reagerer? Og ikke mindst: hvordan laver man stadig
            mad, der smager af noget, når man ikke kan bruge halvdelen af det, man plejer?
          </p>
          <p style={{ color: DARK, fontSize: '18px', lineHeight: 1.75 }}>
            I en travl hverdag savnede jeg ét sted, jeg kunne gå hen — et sted der samler opskrifter,
            viden og svar, uden at man skal rode rundt på tværs af hundrede hjemmesider. Det er Mavro.
          </p>
          <p style={{ color: DARK, fontSize: '18px', lineHeight: 1.75, fontWeight: 700 }}>
            God mad. For alle. Uden kompromiser.
          </p>
        </div>

        {/* ── Divider ──────────────────────────────────────────── */}
        <div style={{ height: '1.5px', backgroundColor: CHIP, margin: '60px 0 0' }} />

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <h2
          style={{
            color: GREEN,
            fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 56px)',
            lineHeight: 1,
            marginTop: '56px',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          Ofte stillede spørgsmål
        </h2>
        <p style={{ color: GREEN, fontSize: '16px', marginBottom: '32px', opacity: 0.7 }}>
          Svar på det vi selv stod og undrede os over.
        </p>

        <div>
          {FAQ.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

      </main>

      <Footer />
    </div>
  )
}
