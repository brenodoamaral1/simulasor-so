import { Processo, ResultadoSimulacao } from './tipos';

export function simularLJF(processos: Processo[]): ResultadoSimulacao[] {
  let tempoAtual = 0;
  const resultado: ResultadoSimulacao[] = [];

  const fila = [...processos];

  while (fila.length > 0) {
    // Filtra processos que já chegaram
    const disponiveis = fila
      .filter(p => p.tempoChegada <= tempoAtual)
      .sort((a, b) => b.duracao - a.duracao); // Maior duração primeiro

    if (disponiveis.length === 0) {
      tempoAtual++; // avança tempo até que algum processo chegue
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

    // Remove da fila original
    const index = fila.findIndex(p => p.id === processo.id);
    fila.splice(index, 1);

    tempoAtual = fim;
  }

  return resultado;
}
