import { Processo, ResultadoSimulacao } from './tipos';

export function simularSJF(processos: Processo[]): ResultadoSimulacao[] {
  const resultado: ResultadoSimulacao[] = [];
  const fila = [...processos]; // cópia dos processos
  let tempoAtual = 0;

  const processosConcluidos = new Set<string>();

  while (processosConcluidos.size < processos.length) {
    // Filtra processos disponíveis no tempo atual
    const disponiveis = fila
      .filter(p => p.tempoChegada <= tempoAtual && !processosConcluidos.has(p.id))
      .sort((a, b) => a.duracao - b.duracao);

    if (disponiveis.length === 0) {
      // Avança o tempo até o próximo processo chegar
      const proximo = fila.find(p => !processosConcluidos.has(p.id));
      tempoAtual = proximo ? proximo.tempoChegada : tempoAtual + 1;
      continue;
    }

    const processo = disponiveis[0];
    const inicio = tempoAtual;
    const fim = inicio + processo.duracao;

    resultado.push({
      id: processo.id,
      inicio,
      fim,
      tempoEspera: inicio - processo.tempoChegada,
      tempoRetorno: fim - processo.tempoChegada,
    });

    tempoAtual = fim;
    processosConcluidos.add(processo.id);
  }

  return resultado;
}
