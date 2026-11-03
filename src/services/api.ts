import type { ErroApi } from '../types/api'

/** URL base da API Java. Configurada em .env (VITE_API_URL) ou na Vercel. */
export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'https://pointway-api.onrender.com'

/** Erro com a mensagem amigável que a API devolve. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, mensagem: string) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
  }
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Função central de requisição (fetch nativo, sem Axios).
 * Todas as chamadas à API passam por aqui.
 */
export async function requisitar<T>(caminho: string, metodo: Metodo = 'GET', corpo?: unknown): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar à API. Verifique sua internet e tente novamente.')
  }

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status} ao acessar a API.`
    try {
      const erro = (await resposta.json()) as Partial<ErroApi>
      if (erro.mensagem) mensagem = erro.mensagem
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new ApiError(resposta.status, mensagem)
  }

  if (resposta.status === 204) return undefined as T
  return (await resposta.json()) as T
}
