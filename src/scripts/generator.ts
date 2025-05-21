import { Processo } from './tipos';

export function gerarProcessosAleatorios(quantidade: number): Processo[] {
  return Array.from({ length: quantidade }, (_, i) => ({
    id: `P${i + 1}`,
    tempoChegada: Math.floor(Math.random() * 10),
    duracao: Math.floor(Math.random() * 8) + 1,
  }));
}
