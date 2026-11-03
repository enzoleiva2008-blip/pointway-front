import { TituloPagina } from '../components/Ui'

const PILARES = [
  { titulo: 'O problema', texto: 'Grande parte dos pontos acumulados na SoulUp expira sem uso, enquanto o transporte público pesa no orçamento de quem mais depende dele.' },
  { titulo: 'A solução', texto: 'O Pointway transforma esses pontos em créditos de transporte, entregues como voucher digital aceito por operadoras parceiras.' },
  { titulo: 'O impacto', texto: 'Cada viagem validada calcula o CO₂ que deixou de ser emitido, mostrando ao usuário o efeito real da sua escolha.' },
]

const TECNOLOGIAS = ['React 19', 'Vite', 'TypeScript', 'Tailwind CSS', 'React Router', 'Java 17 + Spring Boot', 'MySQL', 'Render · Aiven · Vercel']

export default function Sobre() {
  return (
    <>
      <TituloPagina chapeu="Sobre" titulo="Engajamento digital que vira mobilidade real">
        Projeto desenvolvido para o Challenge FIAP 2026 em parceria com a SoulUp.
      </TituloPagina>

      <div className="grid gap-4 md:grid-cols-3">
        {PILARES.map((p) => (
          <section key={p.titulo} className="rounded-2xl border border-marca-200 bg-white p-6">
            <h2 className="text-xl font-bold text-marca-600">{p.titulo}</h2>
            <p className="mt-2 text-apoio">{p.texto}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">Regras de negócio</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-apoio">
            <li>100 pontos = R$ 1,00, com mínimo de 500 pontos por conversão.</li>
            <li>Até 3 vouchers por usuário a cada 24 horas (prevenção de fraude).</li>
            <li>Voucher com código único, validade de 30 dias e uso único.</li>
            <li>Cancelar um voucher não usado devolve os pontos.</li>
            <li>CO₂ evitado = distância × fator do meio de transporte.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Como foi construído</h2>
          <p className="mt-3 text-apoio">
            Este site (front-end) conversa com a API RESTful do projeto, feita em Java com Spring Boot, que grava os dados em
            um banco MySQL na nuvem.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TECNOLOGIAS.map((t) => (
              <li key={t} className="rounded-full border border-marca-200 bg-white px-3 py-1 text-sm">{t}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
