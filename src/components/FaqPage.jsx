import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Footer from './Footer'

const BG = '#004F26'
const ACCENT = '#1AE17A'
const TEXT = '#EFEEE9'
const TEXT_DIM = 'rgba(239, 238, 233, 0.70)'
const DIVIDER = 'rgba(239, 238, 233, 0.12)'

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
    q: 'Kan børn også have gluten- og laktoseintolerans?',
    a: 'Ja. Det kan opstå i alle aldre — også hos børn. Mange forældre opdager det, fordi barnet har mavesmerter, dårlig trivsel eller ondt i led og muskler. Er du i tvivl, er første skridt altid en samtale med din læge.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: `1px solid ${DIVIDER}`, paddingBottom: open ? '20px' : '0' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left flex items-start justify-between gap-4 focus-visible:outline-none"
        style={{ padding: '20px 0', cursor: 'pointer', background: 'none', border: 'none' }}
      >
        <span style={{ color: TEXT, fontWeight: 700, fontSize: '18px', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          color: ACCENT,
          fontSize: '24px',
          lineHeight: 1,
          flexShrink: 0,
          display: 'inline-block',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>+</span>
      </button>
      <div style={{
        overflow: 'hidden',
        maxHeight: open ? '400px' : '0',
        opacity: open ? 1 : 0,
        transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
      }}>
        <p style={{ color: TEXT_DIM, fontSize: '18px', lineHeight: '28px', paddingBottom: '4px', margin: 0 }}>{a}</p>
      </div>
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>

      <header className="pt-8 pb-4 flex flex-col items-start px-6 md:px-10">
        <Link to="/" aria-label="Gå til forsiden"><Logo height={44} /></Link>
      </header>

      <main className="flex-1 max-w-[760px] mx-auto w-full px-6 md:px-10 pb-20">

        <h1 style={{
          color: TEXT,
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 72px)',
          lineHeight: 1,
          marginTop: '60px',
          marginBottom: '16px',
          letterSpacing: '-0.02em',
        }}>
          Ofte stillede spørgsmål
        </h1>
        <p style={{ color: TEXT_DIM, fontSize: '18px', marginBottom: '48px', lineHeight: '28px' }}>
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
