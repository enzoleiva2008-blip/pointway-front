import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-16 bg-marca-900 text-marca-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        <div>
          <Logo claro />
          <p className="mt-3 max-w-xs text-sm text-marca-200">
            Pontos SoulUp que viram passagens de ônibus, metrô, trem e BRT.
          </p>
        </div>
        <nav aria-label="Links do rodapé">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">Navegação</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <li><Link className="hover:text-white" to="/usuarios">Usuários</Link></li>
            <li><Link className="hover:text-white" to="/converter">Converter pontos</Link></li>
            <li><Link className="hover:text-white" to="/catraca">Validar viagem</Link></li>
            <li><Link className="hover:text-white" to="/sobre">Sobre</Link></li>
            <li><Link className="hover:text-white" to="/faq">FAQ</Link></li>
            <li><Link className="hover:text-white" to="/contato">Contato</Link></li>
          </ul>
        </nav>
        <div className="text-sm sm:col-span-2 lg:col-span-1">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-white">Projeto</h2>
          <p className="mt-3 text-marca-200">
            Challenge FIAP 2026 · SoulUp · Turma 1TDSPO
          </p>
          <p className="mt-1 text-marca-200">Equipe Pointway</p>
        </div>
      </div>
    </footer>
  )
}
