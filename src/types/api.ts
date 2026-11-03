/** Tipos das respostas da API Java (Pointway API, Spring Boot). */

/** Union types: os únicos valores aceitos pela API. */
export type ModalTransporte = 'ONIBUS' | 'METRO' | 'TREM' | 'BRT'
export type StatusVoucher = 'ATIVO' | 'UTILIZADO' | 'EXPIRADO'

export interface Usuario {
  id: number
  nome: string
  cpf: string
  email: string
  saldoPontos: number
  dataCadastro: string
}

export interface Operadora {
  id: number
  nome: string
  cidade: string
  sistemaBilhetagem: string | null
}

export interface Voucher {
  id: number
  codigo: string
  usuario: Usuario
  operadora: Operadora
  valorCredito: number
  pontosUtilizados: number
  dataEmissao: string
  dataValidade: string
  status: StatusVoucher
}

export interface Viagem {
  id: number
  voucher: Voucher
  modal: ModalTransporte
  distanciaKm: number
  co2EconomizadoKg: number
  dataUso: string
}

export interface ResumoUsuario {
  usuarioId: number
  nome: string
  saldoPontos: number
  saldoEmReais: number
  totalVouchers: number
  vouchersAtivos: number
  creditoTotalGerado: number
  totalViagens: number
  co2EconomizadoKg: number
}

export interface Impacto {
  totalUsuarios: number
  totalVouchers: number
  pontosConvertidos: number
  creditoGerado: number
  totalViagens: number
  co2EconomizadoKg: number
}

export interface ModalInfo {
  modal: ModalTransporte
  fatorReducaoCO2KgPorKm: number
}

/** Corpo de erro padronizado devolvido pela API (GlobalExceptionHandler). */
export interface ErroApi {
  dataHora: string
  status: number
  erro: string
  mensagem: string
  caminho: string
}

/* ---------- Corpos enviados (requests) ---------- */

/** Campos que o usuário digita; id e datas são gerados pela API. */
export type UsuarioForm = Pick<Usuario, 'nome' | 'cpf' | 'email'> & { saldoPontos?: number }

export interface EmitirVoucherRequest {
  usuarioId: number
  operadoraId: number
  pontos: number
}

export interface ViagemRequest {
  codigoVoucher: string
  modal: ModalTransporte
  distanciaKm: number
}

/* ---------- Tipos de apoio ---------- */

/** Intersection type: usuário + painel de resumo exibidos juntos na página de detalhe. */
export type UsuarioComResumo = Usuario & { resumo: ResumoUsuario }

/** Estado de uma requisição: union discriminada usada pelo hook useApi. */
export type EstadoRequisicao<T> =
  | { status: 'carregando' }
  | { status: 'erro'; mensagem: string }
  | { status: 'sucesso'; dados: T }
