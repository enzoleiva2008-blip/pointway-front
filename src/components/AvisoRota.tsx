import { useLocation } from 'react-router-dom'

/** Mostra a mensagem deixada por um redirecionamento (ex.: parâmetro inválido na URL). */
export default function AvisoRota() {
  const { state } = useLocation() as { state: { aviso?: string } | null }
  if (!state?.aviso) return null
  return (
    <p role="alert" className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
      {state.aviso}
    </p>
  )
}
