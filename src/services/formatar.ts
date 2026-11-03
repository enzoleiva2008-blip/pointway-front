import type { ModalTransporte, StatusVoucher } from '../types/api'

export const reais = (valor: number): string =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const numero = (valor: number, casas = 0): string =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas })

export const data = (iso: string): string => {
  const [ano, mes, dia] = iso.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

export const NOME_MODAL: Record<ModalTransporte, string> = {
  ONIBUS: 'Ônibus',
  METRO: 'Metrô',
  TREM: 'Trem',
  BRT: 'BRT',
}

export const NOME_STATUS: Record<StatusVoucher, string> = {
  ATIVO: 'Ativo',
  UTILIZADO: 'Utilizado',
  EXPIRADO: 'Expirado',
}

/** Mesma regra da API: 100 pontos = R$ 1,00. */
export const TAXA_PONTOS_POR_REAL = 100
export const CONVERSAO_MINIMA = 500
