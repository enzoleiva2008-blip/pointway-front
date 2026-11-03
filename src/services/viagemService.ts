import type { Viagem, ViagemRequest } from '../types/api'
import { requisitar } from './api'

export const viagemService = {
  listarPorUsuario: (usuarioId: number) => requisitar<Viagem[]>(`/viagens?usuarioId=${usuarioId}`),
  registrar: (dados: ViagemRequest) => requisitar<Viagem>('/viagens', 'POST', dados),
}
