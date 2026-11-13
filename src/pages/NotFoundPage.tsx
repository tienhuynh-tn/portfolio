import { Link } from 'react-router-dom'
import Section from '../components/layout/Section'

export default function NotFoundPage() {
  return (
    <Section id="not-found">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="my-6">This page doesn’t exist. You can explore my work from the homepage.</p>
      <Link to="/" className="cardLink">Back to home</Link>
    </Section>
  )
}
