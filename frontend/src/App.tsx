import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Index from './pages/Index.tsx'
import Products from './pages/Products.tsx'
import Routine from './pages/Routine.tsx'
import Auth from './pages/Auth.tsx'
import Profile from './pages/Profile.tsx'
import ProductDetails from './pages/ProductDetails.tsx'
import SkinAnalysis from './pages/SkinAnalysis.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"               element={<Index />} />
        <Route path="/products"       element={<Products />} />
        <Route path="/routine"        element={<Routine />} />
        <Route path="/auth"           element={<Auth />} />
        <Route path="/profile"        element={<Profile />} />
        <Route path="/product/:id"    element={<ProductDetails />} />
        <Route path="/skin-analysis"  element={<SkinAnalysis />} />
      </Routes>
    </Router>
  )
}

export default App
