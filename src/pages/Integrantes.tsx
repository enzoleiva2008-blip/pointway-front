import { Link } from 'react-router-dom'
import { INTEGRANTES } from '../data/integrantes'
import { TituloPagina } from '../components/Ui'
import AvisoRota from '../components/AvisoRota'

export default function Integrantes() {
  return (
    <>
      <TituloPagina chapeu="Equipe Pointway" titulo="Integrantes">
        Turma 1TDSPO · Análise e Desenvolvimento de Sistemas · FIAP
      </TituloPagina>
      <AvisoRota />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {INTEGRANTES.map((i) => (
          <li key={i.rm} className="flex flex-col overflow-hidden rounded-2xl border border-marca-200 bg-white">
            <img src={i.foto} alt={`Foto de ${i.nome}`} className="aspect-square w-full object-cover" />
            <div className="flex flex-1 flex-col p-5">
              <h2 className="text-xl font-bold">{i.nome}</h2>
              <p className="text-sm text-apoio">RM {i.rm} · {i.turma}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
                <a href={i.github} target="_blank" rel="noreferrer" className="rounded-lg bg-tinta px-3 py-1.5 text-white">GitHub</a>
                <a href={i.linkedin} target="_blank" rel="noreferrer" className="rounded-lg bg-[#0A66C2] px-3 py-1.5 text-white">LinkedIn</a>
              </div>
              <Link to={`/integrantes/${i.rm}`} className="mt-auto pt-4 text-sm font-semibold text-marca-600 hover:underline">
                Ver perfil →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
