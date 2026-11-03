import { useCallback, useEffect, useState } from 'react'
import type { EstadoRequisicao } from '../types/api'

/**
 * Executa uma chamada GET à API e controla os estados de carregando, erro e sucesso.
 * `recarregar` executa a chamada de novo (ex.: depois de um cadastro).
 */
export function useApi<T>(buscar: () => Promise<T>, dependencias: ReadonlyArray<unknown> = []) {
  const [estado, setEstado] = useState<EstadoRequisicao<T>>({ status: 'carregando' })
  const [versao, setVersao] = useState(0)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const executar = useCallback(buscar, dependencias)

  useEffect(() => {
    let ativo = true
    setEstado({ status: 'carregando' })
    executar()
      .then((dados) => ativo && setEstado({ status: 'sucesso', dados }))
      .catch((erro: unknown) =>
        ativo && setEstado({ status: 'erro', mensagem: erro instanceof Error ? erro.message : 'Erro inesperado.' }),
      )
    return () => {
      ativo = false
    }
  }, [executar, versao])

  const recarregar = useCallback(() => setVersao((v) => v + 1), [])
  return { estado, recarregar }
}
