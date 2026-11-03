import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

/** Página 404: mostra a mensagem e redireciona para o início em 8 segundos. */
export default function NaoEncontrada() {
  const { pathname } = useLocation()
  const navegar = useNavigate()
  const [segundos, setSegundos] = useState(8)

  useEffect(() => {
    if (segundos === 0) {
      navegar('/', { replace: true })
      return
    }
    const timer = window.setTimeout(() => setSegundos((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [segundos, navegar])

  return (
    <div className="mx-auto max-w-xl py-10 text-center">
      <p className="font-display text-7xl font-bold text-marca-600">404</p>
      <h1 className="mt-3 text-3xl font-bold">Essa parada não existe</h1>
      <p className="mt-2 break-all text-apoio">
        Não encontramos a página <code className="rounded bg-white px-1">{pathname}</code>.
      </p>
      <p className="mt-1 text-apoio">Voltando para o início em {segundos} s...</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-marca-600 px-5 py-3 font-semibold text-white">Ir para o início agora</Link>
    </div>
  )
}
