import type { PerguntaFaq } from '../types/site'

export const PERGUNTAS: PerguntaFaq[] = [
  {
    pergunta: 'O que é o Pointway?',
    resposta:
      'É um módulo da plataforma SoulUp que transforma os pontos acumulados pelos usuários em créditos de transporte público, usados por meio de um voucher digital.',
  },
  {
    pergunta: 'Quanto vale cada ponto?',
    resposta: 'A taxa é de 100 pontos = R$ 1,00. Assim, 800 pontos geram um voucher de R$ 8,00.',
  },
  {
    pergunta: 'Existe um mínimo para converter?',
    resposta: 'Sim. Cada conversão precisa ter pelo menos 500 pontos, e o usuário precisa ter saldo suficiente.',
  },
  {
    pergunta: 'Quantos vouchers posso gerar por dia?',
    resposta:
      'Para evitar fraudes, cada usuário pode emitir no máximo 3 vouchers a cada 24 horas. Depois disso a API recusa novas conversões até o dia seguinte.',
  },
  {
    pergunta: 'Por quanto tempo o voucher vale?',
    resposta:
      'O voucher vale por 30 dias a partir da emissão e pode ser usado uma única vez. Vencido, ele passa automaticamente para o status "Expirado".',
  },
  {
    pergunta: 'Posso cancelar um voucher?',
    resposta: 'Sim, desde que ele ainda não tenha sido usado. Ao cancelar, os pontos voltam para o saldo do usuário.',
  },
  {
    pergunta: 'Como é calculado o CO₂ economizado?',
    resposta:
      'Multiplicamos a distância da viagem pelo fator de cada modal: ônibus 0,09 kg/km, metrô 0,04 kg/km, trem 0,05 kg/km e BRT 0,07 kg/km, em comparação ao uso de carro.',
  },
  {
    pergunta: 'Os dados ficam salvos?',
    resposta:
      'Sim. O site conversa com a API Java do projeto (Spring Boot), que grava usuários, vouchers e viagens em um banco MySQL na nuvem.',
  },
]
