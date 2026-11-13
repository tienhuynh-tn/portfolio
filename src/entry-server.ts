import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './app/App'
export { pages, SITE_URL } from './seo/metadata'

export function render(path: string) {
  return renderToString(createElement(StaticRouter, { location: path }, createElement(App)))
}
