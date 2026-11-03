import type { Impacto, ModalInfo, Operadora } from '../types/api'
import { requisitar } from './api'

export const geralService = {
  impacto: () => requisitar<Impacto>('/impacto'),
  modais: () => requisitar<ModalInfo[]>('/modais'),
  operadoras: (cidade?: string) =>
    requisitar<Operadora[]>(`/operadoras${cidade ? `?cidade=${encodeURIComponent(cidade)}` : ''}`),
}
