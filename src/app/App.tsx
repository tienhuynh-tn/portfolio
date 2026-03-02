import { useEffect, type ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { NAV_ITEMS, type NavItemId } from './navItems'
import Activity from '../sections/Activity'
import About from '../sections/About'
import Certifications from '../sections/Certifications'
import Contact from '../sections/Contact'
import Education from '../sections/Education'
import Experience from '../sections/Experience'
import Hero from '../sections/Hero'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'
import ActivitiesPage from './ActivitiesPage'
import CertificationsPage from './CertificationsPage'
import AppLayout from '../layouts/AppLayout'
import ProjectsPage from '../pages/ProjectsPage'

const SECTION_COMPONENTS: Record<NavItemId, ReactElement> = {
  home: <Hero />,
  about: <About />,
  skills: <Skills />,
  projects: <Projects />,
  experience: <Experience />,
  education: <Education />,
  certifications: <Certifications />,
  activities: <Activity />,
  contact: <Contact />,
}

function HomePage() {
  return (
    <>
      {NAV_ITEMS.map((item) => (
        <div key={item.id}>{SECTION_COMPONENTS[item.id]}</div>
      ))}
    </>
  )
}

function App() {
  useEffect(() => {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.left = ''
    document.body.style.right = ''
    document.body.style.width = ''
    document.body.style.height = ''
  }, [])

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/certifications" element={<CertificationsPage />} />
        <Route path="/credentials" element={<Navigate to="/certifications" replace />} />
      </Route>
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
