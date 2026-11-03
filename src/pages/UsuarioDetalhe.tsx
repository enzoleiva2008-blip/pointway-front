import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { usuarioService } from '../services/usuarioService'
import { voucherService } from '../services/voucherService'
import { data, numero, reais } from '../services/formatar'
import { useAviso } from '../context/AvisoContext'
import { Carregando, ErroCarregar, Vazio } from '../components/Estados'
import { Botao, Campo, Cartao, Numero } from '../components/Ui'
import StatusBadge from '../components/StatusBadge'
import FormUsuario from '../components/FormUsuario'
import type { UsuarioComResumo, UsuarioForm, Voucher } from '../types/api'

async function carregarUsuario(id: number): Promise<UsuarioComResumo> {
  const [usuario, resumo] = await Promise.all([usuarioService.buscar(id), usuarioService.resumo(id)])
  return { ...usuario, resumo }
}

export default function UsuarioDetalhe() {
  const { id } = useParams<{ id: string }>()
  const idNumero = Number(id)

  // Rota dinâmica com parâmetro inválido: volta para a lista com aviso
  if (!Number.isInteger(idNumero) || idNumero <= 0) {
    return <Navigate to="/usuarios" replace state={{ aviso: 'Usuário inválido.' }} />
  }
  return <Detalhe id={idNumero} />
}

function Detalhe({ id }: { id: number }) {
  const { estado, recarregar } = useApi(() => carregarUsuario(id), [id])
  const vouchers = useApi(() => voucherService.listar({ usuarioId: id }), [id])
  const [editando, setEditando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [pontos, setPontos] = useState('')
  const { avisar } = useAviso()
  const navegar = useNavigate()

  function atualizarTudo() {
    recarregar()
    vouchers.recarregar()
  }

  async function executar(acao: () => Promise<unknown>, sucesso: string) {
    setEnviando(true)
    try {
      await acao()
      avisar('sucesso', sucesso)
      return true
    } catch (erro) {
      avisar('erro', erro instanceof Error ? erro.message : 'Erro inesperado.')
      return false
    } finally {
      setEnviando(false)
    }
  }

  async function salvar(dados: UsuarioForm) {
    if (await executar(() => usuarioService.atualizar(id, dados), 'Dados atualizados.')) {
      setEditando(false)
      atualizarTudo()
    }
  }

  async function creditar() {
    const qtd = Number(pontos)
    if (!Number.isInteger(qtd) || qtd <= 0) {
      avisar('erro', 'Informe uma quantidade inteira de pontos maior que zero.')
      return
    }
    if (await executar(() => usuarioService.adicionarPontos(id, qtd), `${numero(qtd)} pontos creditados.`)) {
      setPontos('')
      atualizarTudo()
    }
  }

  async function excluir(nome: string) {
    if (!window.confirm(`Excluir ${nome}? Essa ação não pode ser desfeita.`)) return
    if (await executar(() => usuarioService.excluir(id), `${nome} foi excluído.`)) navegar('/usuarios')
  }

  async function cancelar(voucher: Voucher) {
    if (!window.confirm(`Cancelar o voucher de ${reais(voucher.valorCredito)}? Os pontos voltam para o saldo.`)) return
    if (await executar(() => voucherService.cancelar(voucher.id), 'Voucher cancelado e pontos devolvidos.')) atualizarTudo()
  }

  if (estado.status === 'carregando') return <Carregando texto="Carregando painel do usuário..." />
  if (estado.status === 'erro') {
    return (
      <div className="space-y-4">
        <ErroCarregar mensagem={estado.mensagem} tentarDeNovo={recarregar} />
        <Link to="/usuarios" className="inline-block font-semibold text-marca-600 underline">← Voltar para usuários</Link>
      </div>
    )
  }

  const u = estado.dados
  return (
    <div className="space-y-6">
      <Link to="/usuarios" className="text-sm font-semibold text-marca-600 hover:underline">← Todos os usuários</Link>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-marca-600">Painel do usuário #{u.id}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{u.nome}</h1>
          <p className="text-apoio">{u.email} · CPF {u.cpf} · desde {data(u.dataCadastro)}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to={`/converter?usuario=${u.id}`} className="rounded-xl bg-marca-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-marca-700">
            Converter pontos
          </Link>
          <Botao variante="secundario" onClick={() => setEditando((e) => !e)}>{editando ? 'Fechar edição' : 'Editar'}</Botao>
          <Botao variante="perigo" disabled={enviando} onClick={() => excluir(u.nome)}>Excluir</Botao>
        </div>
      </div>

      {editando && (
        <Cartao>
          <h2 className="mb-4 text-xl font-bold">Editar dados</h2>
          <FormUsuario
            inicial={{ nome: u.nome, cpf: u.cpf, email: u.email, saldoPontos: u.saldoPontos }}
            textoBotao="Salvar alterações" enviando={enviando} aoEnviar={salvar} aoCancelar={() => setEditando(false)}
          />
        </Cartao>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Numero rotulo="Saldo" valor={`${numero(u.resumo.saldoPontos)} pts`} destaque />
        <Numero rotulo="Vale em crédito" valor={reais(u.resumo.saldoEmReais)} />
        <Numero rotulo="Viagens" valor={numero(u.resumo.totalViagens)} />
        <Numero rotulo="CO₂ evitado" valor={`${numero(u.resumo.co2EconomizadoKg, 2)} kg`} />
      </div>

      <Cartao>
        <h2 className="text-xl font-bold">Creditar pontos SoulUp</h2>
        <form
          className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(e) => { e.preventDefault(); void creditar() }}
        >
          <div className="sm:w-60">
            <Campo rotulo="Pontos ganhos" type="number" min={1} value={pontos} onChange={(e) => setPontos(e.target.value)} />
          </div>
          <Botao type="submit" disabled={enviando}>Adicionar pontos</Botao>
        </form>
      </Cartao>

      <section>
        <h2 className="mb-3 text-2xl font-bold">Vouchers ({u.resumo.totalVouchers})</h2>
        {vouchers.estado.status === 'carregando' && <Carregando texto="Buscando vouchers..." />}
        {vouchers.estado.status === 'erro' && <ErroCarregar mensagem={vouchers.estado.mensagem} tentarDeNovo={vouchers.recarregar} />}
        {vouchers.estado.status === 'sucesso' && vouchers.estado.dados.length === 0 && (
          <Vazio titulo="Este usuário ainda não converteu pontos.">
            <Link to={`/converter?usuario=${u.id}`} className="font-semibold text-marca-600 underline">Gerar o primeiro voucher</Link>
          </Vazio>
        )}
        {vouchers.estado.status === 'sucesso' && vouchers.estado.dados.length > 0 && (
          <ul className="grid gap-3 md:grid-cols-2">
            {vouchers.estado.dados.map((v) => (
              <li key={v.id} className="rounded-2xl border border-marca-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-2xl font-bold">{reais(v.valorCredito)}</p>
                    <p className="text-sm text-apoio">{v.operadora.nome} · {numero(v.pontosUtilizados)} pts</p>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
                <p className="mt-3 break-all rounded-lg bg-marca-50 p-2 font-mono text-xs">{v.codigo}</p>
                <p className="mt-2 text-xs text-apoio">Emitido em {data(v.dataEmissao)} · válido até {data(v.dataValidade)}</p>
                {v.status === 'ATIVO' && (
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Link to={`/catraca/${v.codigo}`} className="rounded-xl bg-marca-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-marca-700">
                      Usar na catraca
                    </Link>
                    <Botao variante="perigo" disabled={enviando} onClick={() => cancelar(v)}>Cancelar voucher</Botao>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
