import { Processo, ResultadoSimulacao } from './tipos';

export interface BlocoExecucao {
  id: string;
  inicio: number;
  fim: number;
}

export function simularRoundRobin(
  processos: Processo[],
  quantum: number
): { resultado: ResultadoSimulacao[]; blocos: BlocoExecucao[] } {
  const resultadoMap = new Map<string, ResultadoSimulacao>();
  const tempoRestante = new Map<string, number>();
  const filaChegada = [...processos].sort((a, b) => a.tempoChegada - b.tempoChegada);
  const filaExecucao: Processo[] = [];

  const blocos: BlocoExecucao[] = [];

  let tempoAtual = 0;
  let processosConcluidos = 0;

  while (processosConcluidos < processos.length || filaExecucao.length > 0) {
    while (filaChegada.length > 0 && filaChegada[0].tempoChegada <= tempoAtual) {
      const processo = filaChegada.shift()!;
      filaExecucao.push(processo);
      tempoRestante.set(processo.id, processo.duracao);
    }

    if (filaExecucao.length === 0) {
      tempoAtual++;
      continue;
    }

    const processoAtual = filaExecucao.shift()!;
    const restante = tempoRestante.get(processoAtual.id)!;

    if (!resultadoMap.has(processoAtual.id)) {
      resultadoMap.set(processoAtual.id, {
        id: processoAtual.id,
        inicio: tempoAtual,
        fim: 0,
        tempoEspera: 0,
        tempoRetorno: 0,
      });
    }

    const tempoExecucao = Math.min(quantum, restante);
    const inicio = tempoAtual;
    tempoAtual += tempoExecucao;
    const fim = tempoAtual;

    blocos.push({ id: processoAtual.id, inicio, fim });

    const novoRestante = restante - tempoExecucao;
    tempoRestante.set(processoAtual.id, novoRestante);

    while (filaChegada.length > 0 && filaChegada[0].tempoChegada <= tempoAtual) {
      const processo = filaChegada.shift()!;
      filaExecucao.push(processo);
      tempoRestante.set(processo.id, processo.duracao);
    }

    if (novoRestante > 0) {
      filaExecucao.push(processoAtual);
    } else {
      const resultado = resultadoMap.get(processoAtual.id)!;
      resultado.fim = tempoAtual;
      resultado.tempoRetorno = resultado.fim - processoAtual.tempoChegada;
      resultado.tempoEspera = resultado.tempoRetorno - processoAtual.duracao;
      processosConcluidos++;
    }
  }

  return { resultado: [...resultadoMap.values()], blocos };
}
