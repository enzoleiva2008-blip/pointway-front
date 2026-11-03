import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { geralService } from '../services/geralService'
import { numero, reais } from '../services/formatar'
import { Carregando, ErroCarregar } from '../components/Estados'
import { Numero } from '../components/Ui'

const PASSOS = [
  { n: '1', titulo: 'Acumule pontos', texto: 'Use a plataforma SoulUp e junte pontos no seu saldo.' },
  { n: '2', titulo: 'Converta em voucher', texto: 'A partir de 500 pontos, gere um voucher para a operadora que você usa.' },
  { n: '3', titulo: 'Passe na catraca', texto: 'Use o código no ônibus, metrô, trem ou BRT e veja o CO₂ que você evitou.' },
]

export default function Home() {
  const { estado, recarregar } = useApi(geralService.impacto)

  return (
    <div className="space-y-14">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="inline-block rounded-full bg-marca-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-marca-900">
            Challenge FIAP 2026 · SoulUp
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Seus pontos viram <span className="text-marca-600">viagens</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-apoio">
            O Pointway converte os pontos digitais da SoulUp em créditos de transporte público. Menos pontos parados,
            mais gente se movendo pela cidade e menos CO₂ no ar.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/converter" className="rounded-xl bg-marca-600 px-5 py-3 text-center font-semibold text-white hover:bg-marca-700">
              Converter pontos
            </Link>
            <Link to="/usuarios" className="rounded-xl border border-marca-200 bg-white px-5 py-3 text-center font-semibold hover:bg-marca-100">
              Ver usuários
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-marca-900 p-6 text-white sm:p-8">
          <p className="text-sm uppercase tracking-widest text-marca-200">Exemplo de voucher</p>
          <p className="mt-3 font-display text-5xl font-bold">R$ 8,00</p>
          <p className="mt-1 text-marca-200">800 pontos · SPTrans · válido por 30 dias</p>
          <div className="mt-6 rounded-xl border border-dashed border-marca-500 p-4 font-mono text-xs break-all text-marca-100 sm:text-sm">
            a1b2c3d4-9f21-4e0a-b7c1-55e0f3c2d901
          </div>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sol/30" aria-hidden />
        </div>
      </section>

      <section aria-labelledby="impacto">
        <h2 id="impacto" className="text-2xl font-bold sm:text-3xl">Impacto até agora</h2>
        <p className="mt-1 text-apoio">Números ao vivo, vindos da API do projeto.</p>
        <div className="mt-5">
          {estado.status === 'carregando' && <Carregando />}
          {estado.status === 'erro' && <ErroCarregar mensagem={estado.mensagem} tentarDeNovo={recarregar} />}
          {estado.status === 'sucesso' && (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <Numero rotulo="CO₂ evitado" valor={`${numero(estado.dados.co2EconomizadoKg, 2)} kg`} destaque />
              <Numero rotulo="Usuários" valor={numero(estado.dados.totalUsuarios)} />
              <Numero rotulo="Vouchers" valor={numero(estado.dados.totalVouchers)} />
              <Numero rotulo="Viagens" valor={numero(estado.dados.totalViagens)} />
              <Numero rotulo="Pontos convertidos" valor={numero(estado.dados.pontosConvertidos)} />
              <Numero rotulo="Crédito gerado" valor={reais(estado.dados.creditoGerado)} />
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="como-funciona">
        <h2 id="como-funciona" className="text-2xl font-bold sm:text-3xl">Como funciona</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {PASSOS.map((passo) => (
            <li key={passo.n} className="rounded-2xl border border-marca-200 bg-white p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sol font-bold text-tinta">{passo.n}</span>
              <h3 className="mt-3 text-lg font-bold">{passo.titulo}</h3>
              <p className="mt-1 text-apoio">{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
