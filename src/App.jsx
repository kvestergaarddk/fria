import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import HomePage from './components/HomePage'
import RecipeListPage from './components/RecipeListPage'
import RecipeDetail from './components/RecipeDetail'
import AboutPage from './components/AboutPage'
import FaqPage from './components/FaqPage'
import ContactPage from './components/ContactPage'
import HamburgerMenu from './components/HamburgerMenu'
import CookbookPage from './components/CookbookPage'
import PrivacyPage from './components/PrivacyPage'
import AuthModal from './components/AuthModal'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppInner() {
  const [authModalOpen, setAuthModalOpen] = useState(false)

  return (
    <>
      <ScrollToTop />
      <HamburgerMenu onLoginClick={() => setAuthModalOpen(true)} />
      {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gemte-opskrifter" element={<CookbookPage onLoginClick={() => setAuthModalOpen(true)} />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/om-mavro" element={<AboutPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
        <Route path="/privatlivspolitik" element={<PrivacyPage />} />
        {/* Bevar disse ruter i kode men ikke i nav */}
        <Route path="/glutenfri" element={<RecipeListPage category="glutenfri" />} />
        <Route path="/laktosefri" element={<RecipeListPage category="laktosefri" />} />
        <Route path="/begge" element={<RecipeListPage category="begge" />} />
        <Route path="/opskrift/:id" element={<RecipeDetail />} />
        {/* Redirects for gamle ruter */}
        <Route path="/konverter" element={<Navigate to="/" replace />} />
        <Route path="/kogebog" element={<Navigate to="/gemte-opskrifter" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}
