import { Processo, ResultadoSimulacao } from './tipos';

export function simularPrioridade(processos: Processo[]): ResultadoSimulacao[] {
  let tempoAtual = 0;
  const resultado: ResultadoSimulacao[] = [];

  // Ordena por prioridade e, em caso de empate, por tempo de chegada
  const filaOrdenada = [...processos].sort((a, b) => {
    if ((a.prioridade ?? 0) === (b.prioridade ?? 0)) {
      return a.tempoChegada - b.tempoChegada;
    }
    return (a.prioridade ?? 0) - (b.prioridade ?? 0);
  });

  for (const processo of filaOrdenada) {
    const inicio = Math.max(tempoAtual, processo.tempoChegada);
    const fim = inicio + processo.duracao;

    resultado.push({
      id: processo.id,
      inicio,
      fim,
      tempoEspera: inicio - processo.tempoChegada,
      tempoRetorno: fim - processo.tempoChegada,
    });

    tempoAtual = fim;
  }

  return resultado;
}
