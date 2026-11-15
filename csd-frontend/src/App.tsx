import FloatingWhatsAppButton from './components/FloatingWhatsAppButton'
import SmoothScroll from './components/SmoothScroll'
import LandingPage from './pages/landing'

function App() {
  return (
    <SmoothScroll>
      <LandingPage />
      <FloatingWhatsAppButton />
    </SmoothScroll>
  )
}

export default App
