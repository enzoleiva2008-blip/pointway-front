import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Aviso, TipoAviso } from '../types/site'

interface AvisoContextValor {
  avisar: (tipo: TipoAviso, texto: string) => void
}

const AvisoContext = createContext<AvisoContextValor | null>(null)

const ESTILO: Record<TipoAviso, string> = {
  sucesso: 'bg-marca-600 text-white',
  erro: 'bg-red-700 text-white',
  info: 'bg-tinta text-white',
}

/** Mostra mensagens rápidas (toast) em qualquer página via useContext. */
export function AvisoProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([])

  const avisar = useCallback((tipo: TipoAviso, texto: string) => {
    const id = Date.now() + Math.random()
    setAvisos((lista) => [...lista, { id, tipo, texto }])
    window.setTimeout(() => setAvisos((lista) => lista.filter((a) => a.id !== id)), 5000)
  }, [])

  return (
    <AvisoContext.Provider value={{ avisar }}>
      {children}
      <div
        aria-live="polite"
        className="fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {avisos.map((aviso) => (
          <p
            key={aviso.id}
            role={aviso.tipo === 'erro' ? 'alert' : 'status'}
            className={`w-full max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${ESTILO[aviso.tipo]}`}
          >
            {aviso.texto}
          </p>
        ))}
      </div>
    </AvisoContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAviso(): AvisoContextValor {
  const contexto = useContext(AvisoContext)
  if (!contexto) throw new Error('useAviso precisa estar dentro de <AvisoProvider>.')
  return contexto
}
