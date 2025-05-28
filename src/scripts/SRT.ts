import { Processo, ResultadoSimulacao } from './tipos';

export interface BlocoExecucao {
  id: string;
  inicio: number;
  fim: number;
}

export function simularSRT(processos: Processo[]): {
  resultado: ResultadoSimulacao[];
  blocos: BlocoExecucao[];
} {
  const tempoRestante = new Map<string, number>();
  const resultadoMap = new Map<string, ResultadoSimulacao>();
  const blocos: BlocoExecucao[] = [];

  const fila = [...processos];
  let tempoAtual = 0;
  let emExecucao: Processo | null = null;
  let tempoExecucaoAtual = 0;

  const finalizados = new Set<string>();

  while (finalizados.size < processos.length) {
    const disponiveis = fila
      .filter(p => p.tempoChegada <= tempoAtual && !finalizados.has(p.id))
      .sort((a, b) => {
        const restanteA = tempoRestante.get(a.id) ?? a.duracao;
        const restanteB = tempoRestante.get(b.id) ?? b.duracao;
        return restanteA - restanteB;
      });

    const proximo = disponiveis[0] ?? null;

    // Se houver preempção
    if (proximo && (!emExecucao || proximo.id !== emExecucao.id)) {
      if (emExecucao) {
        blocos.push({
          id: emExecucao.id,
          inicio: tempoAtual - tempoExecucaoAtual,
          fim: tempoAtual,
        });
      }

      emExecucao = proximo;
      tempoExecucaoAtual = 0;

      if (!resultadoMap.has(emExecucao.id)) {
        resultadoMap.set(emExecucao.id, {
          id: emExecucao.id,
          inicio: tempoAtual,
          fim: 0,
          tempoEspera: 0,
          tempoRetorno: 0,
        });
      }
    }

    if (!emExecucao) {
      tempoAtual++;
      continue;
    }

    const restante = tempoRestante.get(emExecucao.id) ?? emExecucao.duracao;
    tempoRestante.set(emExecucao.id, restante - 1);
    tempoAtual++;
    tempoExecucaoAtual++;

    if (restante - 1 === 0) {
      blocos.push({
        id: emExecucao.id,
        inicio: tempoAtual - tempoExecucaoAtual,
        fim: tempoAtual,
      });

      const resultado = resultadoMap.get(emExecucao.id)!;
      resultado.fim = tempoAtual;
      resultado.tempoRetorno = resultado.fim - emExecucao.tempoChegada;
      resultado.tempoEspera = resultado.tempoRetorno - emExecucao.duracao;
      finalizados.add(emExecucao.id);
      emExecucao = null;
    }
  }

  return {
    resultado: [...resultadoMap.values()],
    blocos,
  };
}
