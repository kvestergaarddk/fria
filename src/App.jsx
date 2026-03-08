import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import RecipeListPage from './components/RecipeListPage'
import RecipeDetail from './components/RecipeDetail'
import AboutPage from './components/AboutPage'
import HamburgerMenu from './components/HamburgerMenu'

export default function App() {
  return (
    <BrowserRouter>
      <HamburgerMenu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/glutenfri" element={<RecipeListPage category="glutenfri" />} />
        <Route path="/laktosefri" element={<RecipeListPage category="laktosefri" />} />
        <Route path="/begge" element={<RecipeListPage category="begge" />} />
        <Route path="/opskrift/:id" element={<RecipeDetail />} />
        <Route path="/om-mavro" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
