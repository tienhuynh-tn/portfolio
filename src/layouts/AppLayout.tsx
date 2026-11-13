import { useSyncExternalStore } from 'react'
import { Outlet } from 'react-router-dom'
import CatCursor from '../components/CatCursor'
import ParticleConstellationBackground from '../components/ParticleConstellationBackground'
import ScrollToTop from '../components/ScrollToTop'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import ScrollToTopButton from '../components/layout/ScrollToTop'

const subscribe = () => () => {}

function AppLayout() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  return (
    <>
      <ParticleConstellationBackground />
      {mounted ? <CatCursor /> : null}
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
