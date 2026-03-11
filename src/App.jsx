import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import HomePage from './components/HomePage'
import RecipeListPage from './components/RecipeListPage'
import RecipeDetail from './components/RecipeDetail'
import AboutPage from './components/AboutPage'
import HamburgerMenu from './components/HamburgerMenu'
import ConverterPage from './components/ConverterPage'
import CookbookPage from './components/CookbookPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <HamburgerMenu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/glutenfri" element={<RecipeListPage category="glutenfri" />} />
        <Route path="/laktosefri" element={<RecipeListPage category="laktosefri" />} />
        <Route path="/begge" element={<RecipeListPage category="begge" />} />
        <Route path="/opskrift/:id" element={<RecipeDetail />} />
        <Route path="/om-mavro" element={<AboutPage />} />
        <Route path="/konverter" element={<ConverterPage />} />
        <Route path="/kogebog" element={<CookbookPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
