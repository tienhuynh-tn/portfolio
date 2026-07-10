import { Outlet } from 'react-router-dom'
import ParticleConstellationBackground from '../components/ParticleConstellationBackground'
import ScrollToTop from '../components/ScrollToTop'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import ScrollToTopButton from '../components/layout/ScrollToTop'

function AppLayout() {
  return (
    <>
      <ParticleConstellationBackground />
      <div className="appFrame">
        <Navbar />
        <main className="min-h-screen">
          <ScrollToTop />
          <Outlet />
          <ScrollToTopButton />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default AppLayout
