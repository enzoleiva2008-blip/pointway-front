import type { EmitirVoucherRequest, StatusVoucher, Voucher } from '../types/api'
import { requisitar } from './api'

export const voucherService = {
  listar: (filtro: { usuarioId?: number; status?: StatusVoucher } = {}) => {
    const params = new URLSearchParams()
    if (filtro.usuarioId !== undefined) params.set('usuarioId', String(filtro.usuarioId))
    if (filtro.status) params.set('status', filtro.status)
    const query = params.toString()
    return requisitar<Voucher[]>(`/vouchers${query ? `?${query}` : ''}`)
  },
  buscarPorCodigo: (codigo: string) => requisitar<Voucher>(`/vouchers/codigo/${encodeURIComponent(codigo)}`),
  emitir: (dados: EmitirVoucherRequest) => requisitar<Voucher>('/vouchers', 'POST', dados),
  cancelar: (id: number) => requisitar<void>(`/vouchers/${id}`, 'DELETE'),
}
