import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

export function TituloPagina({ chapeu, titulo, children }: { chapeu: string; titulo: string; children?: ReactNode }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-marca-600">{chapeu}</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{titulo}</h1>
      {children && <div className="mt-3 text-base text-apoio sm:text-lg">{children}</div>}
    </div>
  )
}

export function Cartao({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-marca-200 bg-white p-5 sm:p-6 ${className}`}>{children}</section>
}

type Variante = 'primario' | 'secundario' | 'perigo'

const VARIANTE: Record<Variante, string> = {
  primario: 'bg-marca-600 text-white hover:bg-marca-700',
  secundario: 'border border-marca-200 bg-white text-tinta hover:bg-marca-50',
  perigo: 'border border-red-200 bg-white text-red-700 hover:bg-red-50',
}

export function Botao({
  variante = 'primario',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTE[variante]} ${className}`}
    />
  )
}

const CAMPO = 'mt-1 w-full rounded-xl border border-marca-200 bg-white px-3 py-2.5 text-base focus:border-marca-600 focus:outline-none focus:ring-2 focus:ring-marca-200'

export function Campo({ rotulo, erro, ...props }: InputHTMLAttributes<HTMLInputElement> & { rotulo: string; erro?: string }) {
  return (
    <label className="block text-sm font-medium">
      {rotulo}
      <input {...props} aria-invalid={Boolean(erro)} className={CAMPO} />
      {erro && <span className="mt-1 block text-xs text-red-700">{erro}</span>}
    </label>
  )
}

export function Selecao({
  rotulo,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { rotulo: string; children: ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {rotulo}
      <select {...props} className={CAMPO}>
        {children}
      </select>
    </label>
  )
}

export function Numero({ rotulo, valor, destaque = false }: { rotulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 sm:p-5 ${destaque ? 'bg-marca-600 text-white' : 'border border-marca-200 bg-white'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider ${destaque ? 'text-marca-100' : 'text-apoio'}`}>{rotulo}</p>
      <p className="mt-1 font-display text-2xl font-bold sm:text-3xl">{valor}</p>
    </div>
  )
}
