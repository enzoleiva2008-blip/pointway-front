import { useState, type FormEvent } from 'react'
import { useAviso } from '../context/AvisoContext'
import { Botao, Campo, Cartao, TituloPagina } from '../components/Ui'

interface Mensagem {
  nome: string
  email: string
  assunto: string
  texto: string
}

const VAZIA: Mensagem = { nome: '', email: '', assunto: '', texto: '' }

export default function Contato() {
  const [mensagem, setMensagem] = useState<Mensagem>(VAZIA)
  const [erro, setErro] = useState<string | null>(null)
  const { avisar } = useAviso()

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (mensagem.nome.trim().length < 3) return setErro('Informe seu nome.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mensagem.email)) return setErro('Informe um e-mail válido.')
    if (mensagem.texto.trim().length < 10) return setErro('Escreva uma mensagem com pelo menos 10 caracteres.')
    setErro(null)
    setMensagem(VAZIA)
    avisar('sucesso', 'Mensagem enviada! A equipe Pointway vai responder por e-mail.')
  }

  return (
    <>
      <TituloPagina chapeu="Contato" titulo="Fale com a equipe">
        Dúvidas, sugestões ou parcerias com operadoras de transporte.
      </TituloPagina>
      <div className="grid gap-6 lg:grid-cols-3">
        <Cartao className="lg:col-span-2">
          <form onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Nome" value={mensagem.nome} onChange={(e) => setMensagem({ ...mensagem, nome: e.target.value })} />
            <Campo rotulo="E-mail" type="email" value={mensagem.email} onChange={(e) => setMensagem({ ...mensagem, email: e.target.value })} />
            <div className="sm:col-span-2">
              <Campo rotulo="Assunto" value={mensagem.assunto} onChange={(e) => setMensagem({ ...mensagem, assunto: e.target.value })} />
            </div>
            <label className="block text-sm font-medium sm:col-span-2">
              Mensagem
              <textarea rows={5} value={mensagem.texto} onChange={(e) => setMensagem({ ...mensagem, texto: e.target.value })}
                className="mt-1 w-full rounded-xl border border-marca-200 px-3 py-2.5 focus:border-marca-600 focus:outline-none focus:ring-2 focus:ring-marca-200" />
            </label>
            {erro && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{erro}</p>}
            <div className="sm:col-span-2 sm:text-right">
              <Botao type="submit" className="w-full sm:w-auto">Enviar mensagem</Botao>
            </div>
          </form>
        </Cartao>
        <aside className="space-y-4">
          <Cartao>
            <h2 className="text-lg font-bold">E-mail</h2>
            <p className="mt-1 text-apoio">contato@pointway.com.br</p>
          </Cartao>
          <Cartao>
            <h2 className="text-lg font-bold">Onde estamos</h2>
            <p className="mt-1 text-apoio">FIAP · Av. Paulista, 1106 · São Paulo, SP</p>
          </Cartao>
        </aside>
      </div>
    </>
  )
}
