import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { usuarioService } from '../services/usuarioService'
import { geralService } from '../services/geralService'
import { voucherService } from '../services/voucherService'
import { CONVERSAO_MINIMA, TAXA_PONTOS_POR_REAL, data, numero, reais } from '../services/formatar'
import { useAviso } from '../context/AvisoContext'
import { Carregando, ErroCarregar, Vazio } from '../components/Estados'
import { Botao, Campo, Cartao, Selecao, TituloPagina } from '../components/Ui'
import type { Operadora, Usuario, Voucher } from '../types/api'

async function carregarOpcoes(): Promise<{ usuarios: Usuario[]; operadoras: Operadora[] }> {
  const [usuarios, operadoras] = await Promise.all([usuarioService.listar(), geralService.operadoras()])
  return { usuarios, operadoras }
}

export default function Converter() {
  const [params] = useSearchParams()
  const { estado, recarregar } = useApi(carregarOpcoes)
  const [usuarioId, setUsuarioId] = useState(params.get('usuario') ?? '')
  const [operadoraId, setOperadoraId] = useState('')
  const [pontos, setPontos] = useState(String(CONVERSAO_MINIMA))
  const [enviando, setEnviando] = useState(false)
  const [voucher, setVoucher] = useState<Voucher | null>(null)
  const { avisar } = useAviso()

  const usuario = useMemo(
    () => (estado.status === 'sucesso' ? estado.dados.usuarios.find((u) => String(u.id) === usuarioId) : undefined),
    [estado, usuarioId],
  )
  const qtd = Number(pontos) || 0
  const credito = qtd / TAXA_PONTOS_POR_REAL

  let problema: string | null = null
  if (!usuario) problema = 'Escolha um usuário.'
  else if (!operadoraId) problema = 'Escolha a operadora.'
  else if (qtd < CONVERSAO_MINIMA) problema = `A conversão mínima é de ${CONVERSAO_MINIMA} pontos.`
  else if (qtd > usuario.saldoPontos) problema = `Saldo insuficiente: ${usuario.nome} tem ${numero(usuario.saldoPontos)} pontos.`

  async function converter(evento: FormEvent) {
    evento.preventDefault()
    if (problema || !usuario) return
    setEnviando(true)
    try {
      const novo = await voucherService.emitir({ usuarioId: usuario.id, operadoraId: Number(operadoraId), pontos: qtd })
      setVoucher(novo)
      avisar('sucesso', `Voucher de ${reais(novo.valorCredito)} gerado!`)
      recarregar()
    } catch (erro) {
      avisar('erro', erro instanceof Error ? erro.message : 'Erro ao converter.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <TituloPagina chapeu="Solução · Conversão" titulo="Converter pontos em voucher">
        100 pontos = R$ 1,00. Mínimo de {CONVERSAO_MINIMA} pontos e até 3 vouchers por usuário a cada 24 horas.
      </TituloPagina>

      {estado.status === 'carregando' && <Carregando />}
      {estado.status === 'erro' && <ErroCarregar mensagem={estado.mensagem} tentarDeNovo={recarregar} />}
      {estado.status === 'sucesso' && estado.dados.usuarios.length === 0 && (
        <Vazio titulo="Nenhum usuário cadastrado.">
          <Link to="/usuarios" className="font-semibold text-marca-600 underline">Cadastre um usuário primeiro</Link>
        </Vazio>
      )}

      {estado.status === 'sucesso' && estado.dados.usuarios.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-5">
          <Cartao className="lg:col-span-3">
            <form onSubmit={converter} className="grid gap-4">
              <Selecao rotulo="Usuário" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
                <option value="">Selecione...</option>
                {estado.dados.usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.nome} ({numero(u.saldoPontos)} pts)</option>
                ))}
              </Selecao>
              <Selecao rotulo="Operadora" value={operadoraId} onChange={(e) => setOperadoraId(e.target.value)}>
                <option value="">Selecione...</option>
                {estado.dados.operadoras.map((o) => (
                  <option key={o.id} value={o.id}>{o.nome} · {o.cidade}</option>
                ))}
              </Selecao>
              <Campo rotulo="Pontos a converter" type="number" min={CONVERSAO_MINIMA} step={100} value={pontos}
                onChange={(e) => setPontos(e.target.value)} />
              {problema && <p className="text-sm text-amber-800">{problema}</p>}
              <Botao type="submit" disabled={Boolean(problema) || enviando}>
                {enviando ? 'Gerando voucher...' : `Gerar voucher de ${reais(credito)}`}
              </Botao>
            </form>
          </Cartao>

          <div className="lg:col-span-2">
            {voucher ? (
              <section className="rounded-2xl bg-marca-900 p-6 text-white" aria-live="polite">
                <p className="text-sm uppercase tracking-widest text-marca-200">Voucher gerado</p>
                <p className="mt-2 font-display text-5xl font-bold">{reais(voucher.valorCredito)}</p>
                <p className="mt-1 text-marca-200">{voucher.operadora.nome} · válido até {data(voucher.dataValidade)}</p>
                <p className="mt-4 break-all rounded-xl border border-dashed border-marca-500 p-3 font-mono text-sm">{voucher.codigo}</p>
                <Link to={`/catraca/${voucher.codigo}`} className="mt-4 block rounded-xl bg-sol px-4 py-2.5 text-center font-semibold text-tinta">
                  Usar na catraca →
                </Link>
              </section>
            ) : (
              <section className="rounded-2xl border border-marca-200 bg-white p-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-apoio">Simulação</p>
                <p className="mt-2 font-display text-4xl font-bold text-marca-600">{reais(credito)}</p>
                <p className="mt-1 text-apoio">em crédito de transporte por {numero(qtd)} pontos</p>
                {usuario && (
                  <p className="mt-4 text-sm">
                    Saldo depois da conversão: <strong>{numero(Math.max(usuario.saldoPontos - qtd, 0))} pts</strong>
                  </p>
                )}
              </section>
            )}
          </div>
        </div>
      )}
    </>
  )
}
