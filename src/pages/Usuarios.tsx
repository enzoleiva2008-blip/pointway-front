import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { usuarioService } from '../services/usuarioService'
import { numero } from '../services/formatar'
import { useAviso } from '../context/AvisoContext'
import { Carregando, ErroCarregar, Vazio } from '../components/Estados'
import { Botao, Cartao, TituloPagina } from '../components/Ui'
import FormUsuario from '../components/FormUsuario'
import AvisoRota from '../components/AvisoRota'
import type { UsuarioForm } from '../types/api'

export default function Usuarios() {
  const { estado, recarregar } = useApi(usuarioService.listar)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [busca, setBusca] = useState('')
  const { avisar } = useAviso()
  const navegar = useNavigate()

  async function cadastrar(dados: UsuarioForm) {
    setEnviando(true)
    try {
      const novo = await usuarioService.cadastrar(dados)
      avisar('sucesso', `${novo.nome} cadastrado com sucesso!`)
      navegar(`/usuarios/${novo.id}`)
    } catch (erro) {
      avisar('erro', erro instanceof Error ? erro.message : 'Erro ao cadastrar.')
    } finally {
      setEnviando(false)
    }
  }

  const filtrados =
    estado.status === 'sucesso'
      ? estado.dados.filter((u) => u.nome.toLowerCase().includes(busca.toLowerCase()) || u.cpf.includes(busca))
      : []

  return (
    <>
      <TituloPagina chapeu="Solução · Usuários" titulo="Usuários SoulUp">
        Veja quem já participa, cadastre novos usuários e abra o painel de cada um.
      </TituloPagina>

      <AvisoRota />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou CPF"
          aria-label="Buscar usuário"
          className="w-full rounded-xl border border-marca-200 bg-white px-3 py-2.5 sm:max-w-xs"
        />
        <Botao onClick={() => setMostrarForm((m) => !m)}>{mostrarForm ? 'Fechar cadastro' : '+ Novo usuário'}</Botao>
      </div>

      {mostrarForm && (
        <Cartao className="mb-6">
          <h2 className="mb-4 text-xl font-bold">Cadastrar usuário</h2>
          <FormUsuario textoBotao="Cadastrar" enviando={enviando} aoEnviar={cadastrar} aoCancelar={() => setMostrarForm(false)} />
        </Cartao>
      )}

      {estado.status === 'carregando' && <Carregando texto="Buscando usuários..." />}
      {estado.status === 'erro' && <ErroCarregar mensagem={estado.mensagem} tentarDeNovo={recarregar} />}
      {estado.status === 'sucesso' && filtrados.length === 0 && (
        <Vazio titulo={busca ? 'Nenhum usuário encontrado para essa busca.' : 'Nenhum usuário cadastrado ainda.'}>
          {!busca && 'Clique em "+ Novo usuário" para cadastrar o primeiro.'}
        </Vazio>
      )}
      {filtrados.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((u) => (
            <li key={u.id}>
              <Link
                to={`/usuarios/${u.id}`}
                className="block h-full rounded-2xl border border-marca-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-marca-500 hover:shadow-md"
              >
                <p className="text-lg font-bold">{u.nome}</p>
                <p className="text-sm text-apoio">{u.email}</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-apoio">Saldo</p>
                <p className="font-display text-2xl font-bold text-marca-600">{numero(u.saldoPontos)} pts</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
