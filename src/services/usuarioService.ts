import type { ResumoUsuario, Usuario, UsuarioForm } from '../types/api'
import { requisitar } from './api'

export const usuarioService = {
  listar: () => requisitar<Usuario[]>('/usuarios'),
  buscar: (id: number) => requisitar<Usuario>(`/usuarios/${id}`),
  resumo: (id: number) => requisitar<ResumoUsuario>(`/usuarios/${id}/resumo`),
  cadastrar: (dados: UsuarioForm) => requisitar<Usuario>('/usuarios', 'POST', dados),
  atualizar: (id: number, dados: UsuarioForm) => requisitar<Usuario>(`/usuarios/${id}`, 'PUT', dados),
  adicionarPontos: (id: number, pontos: number) =>
    requisitar<Usuario>(`/usuarios/${id}/pontos`, 'PATCH', { pontos }),
  excluir: (id: number) => requisitar<void>(`/usuarios/${id}`, 'DELETE'),
}
