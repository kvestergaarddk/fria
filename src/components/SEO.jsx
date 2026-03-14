import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://mavro.dk'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

export default function SEO({ title, description, path = '', image }) {
  const fullTitle = title ? `Mavro — ${title}` : 'Mavro — Mad til glade maver'
  const fullDescription = description || 'Mavro konverterer dine yndlingsopskrifter til glutenfri og/eller laktosefri versioner med AI. Prøv det gratis.'
  const canonical = `${SITE_URL}${path}`
  const ogImage = image || DEFAULT_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="da_DK" />
      <meta property="og:site_name" content="Mavro" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
