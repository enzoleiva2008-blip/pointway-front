import { useState } from 'react'
import { PERGUNTAS } from '../data/faq'
import { TituloPagina } from '../components/Ui'

export default function Faq() {
  const [aberta, setAberta] = useState<number | null>(0)

  return (
    <>
      <TituloPagina chapeu="FAQ" titulo="Perguntas frequentes" />
      <ul className="max-w-3xl space-y-3">
        {PERGUNTAS.map((p, indice) => {
          const estaAberta = aberta === indice
          return (
            <li key={p.pergunta} className="rounded-2xl border border-marca-200 bg-white">
              <button
                type="button"
                aria-expanded={estaAberta}
                onClick={() => setAberta(estaAberta ? null : indice)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
              >
                {p.pergunta}
                <span aria-hidden className="text-xl text-marca-600">{estaAberta ? '−' : '+'}</span>
              </button>
              {estaAberta && <p className="px-5 pb-5 text-apoio">{p.resposta}</p>}
            </li>
          )
        })}
      </ul>
    </>
  )
}
