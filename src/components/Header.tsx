import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { LinkMenu } from '../types/site'
import Logo from './Logo'

const LINKS: LinkMenu[] = [
  { para: '/', rotulo: 'Início' },
  { para: '/usuarios', rotulo: 'Usuários' },
  { para: '/converter', rotulo: 'Converter pontos' },
  { para: '/catraca', rotulo: 'Validar viagem' },
  { para: '/operadoras', rotulo: 'Operadoras' },
  { para: '/sobre', rotulo: 'Sobre' },
  { para: '/integrantes', rotulo: 'Integrantes' },
  { para: '/faq', rotulo: 'FAQ' },
  { para: '/contato', rotulo: 'Contato' },
]

export default function Header() {
  const [aberto, setAberto] = useState(false)

  const classeLink = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'bg-marca-100 text-marca-900' : 'text-apoio hover:bg-marca-50 hover:text-tinta'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-marca-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="shrink-0" onClick={() => setAberto(false)}>
          <Logo />
        </Link>

        <button
          type="button"
          className="rounded-lg border border-marca-200 px-3 py-2 text-sm font-semibold lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((a) => !a)}
        >
          {aberto ? 'Fechar' : 'Menu'}
        </button>

        <nav id="menu-principal" aria-label="Menu principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.para}>
                <NavLink to={link.para} end={link.para === '/'} className={classeLink}>
                  {link.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {aberto && (
        <nav aria-label="Menu principal (celular)" className="border-t border-marca-200 bg-white lg:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-2 sm:px-6">
            {LINKS.map((link) => (
              <li key={link.para}>
                <NavLink to={link.para} end={link.para === '/'} className={classeLink} onClick={() => setAberto(false)}>
                  {link.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
