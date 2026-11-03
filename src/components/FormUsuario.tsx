import { useState, type FormEvent } from 'react'
import type { UsuarioForm } from '../types/api'
import { Botao, Campo } from './Ui'

type Erros = Partial<Record<keyof UsuarioForm, string>>

interface Props {
  inicial?: UsuarioForm
  textoBotao: string
  enviando: boolean
  aoEnviar: (dados: UsuarioForm) => void
  aoCancelar?: () => void
}

/** Validação básica no navegador; a API valida de novo (CPF com dígitos verificadores, e-mail, duplicidade). */
function validar(dados: UsuarioForm): Erros {
  const erros: Erros = {}
  if (dados.nome.trim().length < 3) erros.nome = 'Informe o nome completo (mínimo 3 letras).'
  if (dados.cpf.replace(/\D/g, '').length !== 11) erros.cpf = 'O CPF precisa ter 11 números.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim())) erros.email = 'E-mail inválido.'
  if (dados.saldoPontos !== undefined && (Number.isNaN(dados.saldoPontos) || dados.saldoPontos < 0)) {
    erros.saldoPontos = 'O saldo não pode ser negativo.'
  }
  return erros
}

export default function FormUsuario({ inicial, textoBotao, enviando, aoEnviar, aoCancelar }: Props) {
  const [dados, setDados] = useState<UsuarioForm>(inicial ?? { nome: '', cpf: '', email: '', saldoPontos: 0 })
  const [erros, setErros] = useState<Erros>({})

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const encontrados = validar(dados)
    setErros(encontrados)
    if (Object.keys(encontrados).length === 0) aoEnviar(dados)
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Campo rotulo="Nome completo" value={dados.nome} erro={erros.nome}
          onChange={(e) => setDados({ ...dados, nome: e.target.value })} autoComplete="name" />
      </div>
      <Campo rotulo="CPF" value={dados.cpf} erro={erros.cpf} inputMode="numeric" placeholder="000.000.000-00"
        onChange={(e) => setDados({ ...dados, cpf: e.target.value })} />
      <Campo rotulo="E-mail" type="email" value={dados.email} erro={erros.email} autoComplete="email"
        onChange={(e) => setDados({ ...dados, email: e.target.value })} />
      <Campo rotulo="Saldo de pontos SoulUp" type="number" min={0} value={dados.saldoPontos ?? 0} erro={erros.saldoPontos}
        onChange={(e) => setDados({ ...dados, saldoPontos: e.target.valueAsNumber })} />
      <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
        {aoCancelar && <Botao type="button" variante="secundario" onClick={aoCancelar}>Cancelar</Botao>}
        <Botao type="submit" disabled={enviando}>{enviando ? 'Salvando...' : textoBotao}</Botao>
      </div>
    </form>
  )
}
