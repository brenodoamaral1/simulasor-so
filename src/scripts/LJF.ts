import { Processo, ResultadoSimulacao } from './tipos';

export function simularLJF(processos: Processo[]): ResultadoSimulacao[] {
  let tempoAtual = 0;
  const resultado: ResultadoSimulacao[] = [];
  const fila = [...processos];

  while (fila.length > 0) {
    const disponiveis = fila.filter(p => p.tempoChegada <= tempoAtual);

    if (disponiveis.length === 0) {
      // Nenhum processo disponível, avança até o próximo chegar
      tempoAtual = Math.min(...fila.map(p => p.tempoChegada));
      continue;
    }

    // Entre os disponíveis, pega o de maior duração
    // Se houver empate na duração, desempata pelo menor tempo de chegada
    const processo = disponiveis.sort((a, b) =>
      b.duracao !== a.duracao
        ? b.duracao - a.duracao
        : a.tempoChegada - b.tempoChegada
    )[0];

    const inicio = tempoAtual;
    const fim = inicio + processo.duracao;

    resultado.push({
      id: processo.id,
      inicio,
      fim,
      tempoEspera: inicio - processo.tempoChegada,
      tempoRetorno: fim - processo.tempoChegada,
    });

    // Remove da fila
    const index = fila.findIndex(p => p.id === processo.id);
    fila.splice(index, 1);

    tempoAtual = fim;
  }

  return resultado;
}
