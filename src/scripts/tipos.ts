export interface Processo {
  id: string;
  tempoChegada: number;
  duracao: number;
  prioridade?: number; // opcional, para algoritmos que usam
}

export interface ResultadoSimulacao {
  id: string;
  inicio: number;
  fim: number;
  tempoEspera: number;
  tempoRetorno: number;
}
