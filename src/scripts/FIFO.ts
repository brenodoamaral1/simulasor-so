export interface Processo {
    id: string;
    tempoChegada: number;
    duracao: number;
  }
  
  export interface ResultadoSimulacao {
    id: string;
    inicio: number;
    fim: number;
    tempoEspera: number;
    tempoRetorno: number;
  }
  
  export function simularFIFO(processos: Processo[]): ResultadoSimulacao[] {
    let tempoAtual = 0;
    const resultado: ResultadoSimulacao[] = [];
  
    processos.sort((a, b) => a.tempoChegada - b.tempoChegada);
  
    for (const processo of processos) {
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
  