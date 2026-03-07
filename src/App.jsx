import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RecipeList from './components/RecipeList'
import RecipeDetail from './components/RecipeDetail'
import AboutPage from './components/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/opskrift/:id" element={<RecipeDetail />} />
        <Route path="/om-mavro" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
