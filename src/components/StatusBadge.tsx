import type { StatusVoucher } from '../types/api'
import { NOME_STATUS } from '../services/formatar'

const COR: Record<StatusVoucher, string> = {
  ATIVO: 'bg-marca-100 text-marca-900',
  UTILIZADO: 'bg-slate-100 text-slate-700',
  EXPIRADO: 'bg-amber-100 text-amber-900',
}

export default function StatusBadge({ status }: { status: StatusVoucher }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${COR[status]}`}>{NOME_STATUS[status]}</span>
}
