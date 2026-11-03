import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { geralService } from '../services/geralService'
import { voucherService } from '../services/voucherService'
import { viagemService } from '../services/viagemService'
import { NOME_MODAL, data, numero, reais } from '../services/formatar'
import { useAviso } from '../context/AvisoContext'
import { Carregando, ErroCarregar } from '../components/Estados'
import { Botao, Campo, Cartao, Selecao, TituloPagina } from '../components/Ui'
import StatusBadge from '../components/StatusBadge'
import type { ModalTransporte, Viagem, Voucher } from '../types/api'

/** Página com rota dinâmica opcional: /catraca/:codigo já abre com o voucher preenchido. */
export default function Catraca() {
  const { codigo } = useParams<{ codigo?: string }>()
  const navegar = useNavigate()
  const modais = useApi(geralService.modais)
  const [codigoDigitado, setCodigoDigitado] = useState(codigo ?? '')
  const [voucher, setVoucher] = useState<Voucher | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [erroBusca, setErroBusca] = useState<string | null>(null)
  const [modal, setModal] = useState<ModalTransporte>('ONIBUS')
  const [distancia, setDistancia] = useState('10')
  const [enviando, setEnviando] = useState(false)
  const [viagem, setViagem] = useState<Viagem | null>(null)
  const { avisar } = useAviso()

  useEffect(() => {
    if (!codigo) return
    let ativo = true
    setBuscando(true)
    setErroBusca(null)
    setViagem(null)
    setCodigoDigitado(codigo)
    voucherService
      .buscarPorCodigo(codigo)
      .then((v) => ativo && setVoucher(v))
      .catch((erro: unknown) => {
        if (!ativo) return
        setVoucher(null)
        setErroBusca(erro instanceof Error ? erro.message : 'Voucher não encontrado.')
      })
      .finally(() => ativo && setBuscando(false))
    return () => {
      ativo = false
    }
  }, [codigo])

  function buscar(evento: FormEvent) {
    evento.preventDefault()
    const limpo = codigoDigitado.trim()
    if (!limpo) {
      setErroBusca('Digite o código do voucher.')
      return
    }
    navegar(`/catraca/${limpo}`)
  }

  const fator = modais.estado.status === 'sucesso'
    ? modais.estado.dados.find((m) => m.modal === modal)?.fatorReducaoCO2KgPorKm ?? 0
    : 0
  const km = Number(distancia) || 0

  async function validar(evento: FormEvent) {
    evento.preventDefault()
    if (!voucher) return
    if (km <= 0 || km > 200) {
      avisar('erro', 'A distância deve ser maior que 0 e no máximo 200 km.')
      return
    }
    setEnviando(true)
    try {
      const nova = await viagemService.registrar({ codigoVoucher: voucher.codigo, modal, distanciaKm: km })
      setViagem(nova)
      setVoucher(nova.voucher.status === 'UTILIZADO' ? nova.voucher : { ...voucher, status: 'UTILIZADO' })
      avisar('sucesso', 'Passagem liberada! Boa viagem.')
    } catch (erro) {
      avisar('erro', erro instanceof Error ? erro.message : 'Erro ao validar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <TituloPagina chapeu="Solução · Catraca" titulo="Validar viagem">
        Simula a catraca: informe o código do voucher, o meio de transporte e a distância. O voucher é de uso único.
      </TituloPagina>

      <Cartao className="mb-6">
        <form onSubmit={buscar} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Campo rotulo="Código do voucher" value={codigoDigitado} placeholder="cole o código aqui"
              onChange={(e) => setCodigoDigitado(e.target.value)} />
          </div>
          <Botao type="submit" variante="secundario">Buscar voucher</Botao>
        </form>
      </Cartao>

      {buscando && <Carregando texto="Procurando voucher..." />}
      {erroBusca && !buscando && <ErroCarregar mensagem={erroBusca} />}

      {voucher && !buscando && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Cartao>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-3xl font-bold">{reais(voucher.valorCredito)}</p>
                <p className="text-apoio">{voucher.usuario.nome} · {voucher.operadora.nome}</p>
              </div>
              <StatusBadge status={voucher.status} />
            </div>
            <p className="mt-3 break-all rounded-lg bg-marca-50 p-2 font-mono text-xs">{voucher.codigo}</p>
            <p className="mt-2 text-sm text-apoio">Válido até {data(voucher.dataValidade)}</p>
            <Link to={`/usuarios/${voucher.usuario.id}`} className="mt-3 inline-block text-sm font-semibold text-marca-600 underline">
              Ver painel de {voucher.usuario.nome}
            </Link>
          </Cartao>

          {viagem ? (
            <section className="rounded-2xl bg-marca-600 p-6 text-white" aria-live="polite">
              <p className="text-4xl" aria-hidden>✓</p>
              <h2 className="mt-2 text-2xl font-bold">Passagem liberada</h2>
              <p className="mt-1 text-marca-100">
                {NOME_MODAL[viagem.modal]} · {numero(viagem.distanciaKm, 1)} km
              </p>
              <p className="mt-4 font-display text-4xl font-bold">+{numero(viagem.co2EconomizadoKg, 2)} kg</p>
              <p className="text-marca-100">de CO₂ que deixaram de ir para o ar</p>
            </section>
          ) : voucher.status !== 'ATIVO' ? (
            <section className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
              <h2 className="text-xl font-bold text-amber-900">Este voucher não pode ser usado</h2>
              <p className="mt-1 text-amber-900">Ele está {voucher.status === 'UTILIZADO' ? 'utilizado' : 'expirado'}. Gere um novo voucher.</p>
              <Link to="/converter" className="mt-3 inline-block font-semibold text-amber-900 underline">Converter pontos</Link>
            </section>
          ) : (
            <Cartao>
              <form onSubmit={validar} className="grid gap-4">
                <Selecao rotulo="Meio de transporte" value={modal} onChange={(e) => setModal(e.target.value as ModalTransporte)}>
                  {(Object.keys(NOME_MODAL) as ModalTransporte[]).map((m) => (
                    <option key={m} value={m}>{NOME_MODAL[m]}</option>
                  ))}
                </Selecao>
                <Campo rotulo="Distância (km)" type="number" min={0.1} max={200} step={0.1} value={distancia}
                  onChange={(e) => setDistancia(e.target.value)} />
                <p className="text-sm text-apoio">
                  Estimativa: <strong>{numero(km * fator, 2)} kg de CO₂</strong> evitados ({numero(fator, 2)} kg/km).
                </p>
                <Botao type="submit" disabled={enviando}>{enviando ? 'Validando...' : 'Passar na catraca'}</Botao>
              </form>
            </Cartao>
          )}
        </div>
      )}
    </>
  )
}
