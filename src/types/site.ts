/** Tipos do conteúdo estático do site. */

export interface Integrante {
  rm: string
  nome: string
  turma: string
  funcao: string
  foto: string
  github: string
  linkedin: string
}

export interface PerguntaFaq {
  pergunta: string
  resposta: string
}

export type TipoAviso = 'sucesso' | 'erro' | 'info'

export interface Aviso {
  id: number
  tipo: TipoAviso
  texto: string
}

export interface LinkMenu {
  para: string
  rotulo: string
}
