import { Processo, ResultadoSimulacao } from './tipos';


export function simularSRT(processos: Processo[]): ResultadoSimulacao[] {
  // Clonar os processos e adicionar tempo restante
  const processosRestantes = processos.map(p => ({
    ...p,
    tempoRestante: p.duracao,
    inicioExecucao: -1,
  }));

  const resultadoMap = new Map<string, ResultadoSimulacao>();

  let tempoAtual = 0;
  let processoAtual: typeof processosRestantes[0] | null = null;

  while (processosRestantes.some(p => p.tempoRestante > 0)) {
    // Filtra os processos que chegaram até o tempo atual e ainda não terminaram
    const prontos = processosRestantes.filter(
      p => p.tempoChegada <= tempoAtual && p.tempoRestante > 0
    );

    if (prontos.length > 0) {
      // Escolhe o processo com menor tempo restante
      const menor = prontos.reduce((a, b) =>
        a.tempoRestante < b.tempoRestante ? a : b
      );

      if (processoAtual !== menor) {
        processoAtual = menor;

        if (processoAtual.inicioExecucao === -1) {
          processoAtual.inicioExecucao = tempoAtual;
        }
      }

      // Executa o processo por 1 unidade de tempo
      processoAtual.tempoRestante--;

      // Se terminou, registra o resultado
      if (processoAtual.tempoRestante === 0) {
        const tempoFim = tempoAtual + 1;
        resultadoMap.set(processoAtual.id, {
          id: processoAtual.id,
          inicio: processoAtual.inicioExecucao,
          fim: tempoFim,
          tempoEspera:
            tempoFim -
            processoAtual.tempoChegada -
            processoAtual.duracao,
          tempoRetorno: tempoFim - processoAtual.tempoChegada,
        });
      }
    }

    tempoAtual++;
  }

  return processos.map(p => resultadoMap.get(p.id)!);
}