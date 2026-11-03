import { useState } from 'react'
import { useApi } from '../hooks/useApi'
import { geralService } from '../services/geralService'
import { Carregando, ErroCarregar, Vazio } from '../components/Estados'
import { TituloPagina } from '../components/Ui'

export default function Operadoras() {
  const [cidade, setCidade] = useState('')
  const [filtro, setFiltro] = useState('')
  const { estado, recarregar } = useApi(() => geralService.operadoras(filtro || undefined), [filtro])

  return (
    <>
      <TituloPagina chapeu="Solução · Parceiras" titulo="Operadoras parceiras">
        Empresas de transporte onde os vouchers Pointway podem ser usados.
      </TituloPagina>

      <form
        className="mb-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => { e.preventDefault(); setFiltro(cidade.trim()) }}
      >
        <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Filtrar por cidade (ex.: Sao Paulo)"
          aria-label="Cidade" className="w-full rounded-xl border border-marca-200 bg-white px-3 py-2.5 sm:max-w-sm" />
        <div className="flex gap-2">
          <button type="submit" className="flex-1 rounded-xl bg-marca-600 px-4 py-2.5 text-sm font-semibold text-white sm:flex-none">Filtrar</button>
          {filtro && (
            <button type="button" onClick={() => { setCidade(''); setFiltro('') }}
              className="flex-1 rounded-xl border border-marca-200 bg-white px-4 py-2.5 text-sm font-semibold sm:flex-none">Limpar</button>
          )}
        </div>
      </form>

      {estado.status === 'carregando' && <Carregando texto="Buscando operadoras..." />}
      {estado.status === 'erro' && <ErroCarregar mensagem={estado.mensagem} tentarDeNovo={recarregar} />}
      {estado.status === 'sucesso' && estado.dados.length === 0 && <Vazio titulo={`Nenhuma operadora em "${filtro}".`} />}
      {estado.status === 'sucesso' && estado.dados.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {estado.dados.map((o) => (
            <li key={o.id} className="rounded-2xl border border-marca-200 bg-white p-5">
              <p className="text-lg font-bold">{o.nome}</p>
              <p className="text-sm text-apoio">{o.cidade}</p>
              {o.sistemaBilhetagem && (
                <p className="mt-3 inline-block rounded-full bg-marca-100 px-2.5 py-1 text-xs font-semibold text-marca-900">
                  {o.sistemaBilhetagem}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
