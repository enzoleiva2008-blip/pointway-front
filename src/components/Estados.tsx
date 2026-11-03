import type { ReactNode } from 'react'

/** Mensagem enquanto a API responde (o Render gratuito pode levar ~50 s para "acordar"). */
export function Carregando({ texto = 'Carregando dados da API...' }: { texto?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 rounded-2xl border border-marca-200 bg-white p-8 text-center">
      <span className="h-8 w-8 animate-spin rounded-full border-4 border-marca-200 border-t-marca-600" aria-hidden />
      <p className="font-medium">{texto}</p>
      <p className="max-w-sm text-sm text-apoio">
        No primeiro acesso o servidor gratuito pode levar até 1 minuto para acordar.
      </p>
    </div>
  )
}

export function ErroCarregar({ mensagem, tentarDeNovo }: { mensagem: string; tentarDeNovo?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-semibold text-red-800">Não foi possível carregar.</p>
      <p className="mt-1 text-sm text-red-700">{mensagem}</p>
      {tentarDeNovo && (
        <button type="button" onClick={tentarDeNovo} className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
          Tentar de novo
        </button>
      )}
    </div>
  )
}

export function Vazio({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-marca-200 bg-white p-8 text-center">
      <p className="font-semibold">{titulo}</p>
      {children && <div className="mt-2 text-sm text-apoio">{children}</div>}
    </div>
  )
}
