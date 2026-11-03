import { Link, Navigate, useParams } from 'react-router-dom'
import { INTEGRANTES } from '../data/integrantes'

/** Rota dinâmica /integrantes/:rm. RM inexistente redireciona com mensagem. */
export default function IntegranteDetalhe() {
  const { rm } = useParams<{ rm: string }>()
  const integrante = INTEGRANTES.find((i) => i.rm === rm)

  if (!integrante) {
    return <Navigate to="/integrantes" replace state={{ aviso: `Não existe integrante com o RM ${rm}.` }} />
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/integrantes" className="text-sm font-semibold text-marca-600 hover:underline">← Todos os integrantes</Link>
      <div className="mt-4 grid gap-6 overflow-hidden rounded-3xl border border-marca-200 bg-white sm:grid-cols-5">
        <img src={integrante.foto} alt={`Foto de ${integrante.nome}`} className="aspect-square w-full object-cover sm:col-span-2 sm:h-full" />
        <div className="p-6 sm:col-span-3 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-marca-600">{integrante.funcao}</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{integrante.nome}</h1>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-apoio">RM</dt><dd className="font-semibold">{integrante.rm}</dd></div>
            <div><dt className="text-apoio">Turma</dt><dd className="font-semibold">{integrante.turma}</dd></div>
          </dl>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a href={integrante.github} target="_blank" rel="noreferrer" className="rounded-xl bg-tinta px-4 py-2.5 text-center font-semibold text-white">GitHub</a>
            <a href={integrante.linkedin} target="_blank" rel="noreferrer" className="rounded-xl bg-[#0A66C2] px-4 py-2.5 text-center font-semibold text-white">LinkedIn</a>
          </div>
        </div>
      </div>
    </article>
  )
}
