import { ChangeEvent, useState } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { Processo, ResultadoSimulacao } from './scripts/tipos';
import { simularFIFO } from './scripts/FIFO';
import { simularPrioridade } from './scripts/Prioridade';
import { simularSJF } from './scripts/SJF';
import { simularRoundRobin, BlocoExecucao as BlocoRR } from './scripts/RR';
import { simularSRT, BlocoExecucao as BlocoSRT } from './scripts/SRT';
import { simularLJF } from './scripts/LJF';
import { gerarProcessosAleatorios } from './scripts/generator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  Cell,
} from 'recharts';

function App() {
  const [algoritmoSelecionado, setAlgoritmoSelecionado] = useState<string | null>('checkbox1');
  const [resultados, setResultados] = useState<ResultadoSimulacao[]>([]);
  const [blocosRR, setBlocosRR] = useState<BlocoRR[]>([]);
  const [blocosSRT, setBlocosSRT] = useState<BlocoSRT[]>([]);
  const [quantidadeProcessos, setQuantidadeProcessos] = useState<number>(4);
  const [processosGerados, setProcessosGerados] = useState<Processo[]>([]);

  const aoAlterarCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const valor = event.target.name;
    const novoSelecionado = algoritmoSelecionado === valor ? null : valor;
    setAlgoritmoSelecionado(novoSelecionado);
    setResultados([]);
    setBlocosRR([]);
    setBlocosSRT([]);
  };

  const executarSimulacao = () => {
    const processos = gerarProcessosAleatorios(quantidadeProcessos);
    setProcessosGerados(processos);

    let resultado: ResultadoSimulacao[] = [];
    setBlocosRR([]);
    setBlocosSRT([]);

    if (algoritmoSelecionado === 'checkbox1') {
      resultado = simularFIFO(processos);
    } else if (algoritmoSelecionado === 'checkbox2') {
      resultado = simularSJF(processos);
    } else if (algoritmoSelecionado === 'checkbox3') {
      const { resultado: srtResultado, blocos } = simularSRT(processos);
      setBlocosSRT(blocos);
      resultado = srtResultado;
    } else if (algoritmoSelecionado === 'checkbox4') {
      const quantum = 2;
      const { resultado: rrResultado, blocos } = simularRoundRobin(processos, quantum);
      setBlocosRR(blocos);
      resultado = rrResultado;
    } else if (algoritmoSelecionado === 'checkbox5') {
      resultado = simularLJF(processos);
    } else if (algoritmoSelecionado === 'checkbox6') {
      resultado = simularPrioridade(processos);
    }

    setResultados(resultado);
  };

  return (
    <div className="container">

      <img src="./src/assets/LogoEscalonamento.png" alt="Logo" className="logo" />
      <h1>Simulação de Escalonamento</h1>

      <div className="simulator-grid">
        <div className="form-section">
          <TextField
            label="Quantidade de processos"
            type="number"
            value={quantidadeProcessos}
            onChange={(e) => setQuantidadeProcessos(Number(e.target.value))}
            inputProps={{ min: 1, max: 10 }}
            fullWidth
          />

          <h3>Selecione o algoritmo:</h3>
          <div className="checkbox-columns">
            <div className="checkbox-column">
              <FormControlLabel
                control={<Checkbox checked={algoritmoSelecionado === 'checkbox1'} onChange={aoAlterarCheckbox} name="checkbox1" />}
                label="FIFO"
              />
              <FormControlLabel
                control={<Checkbox checked={algoritmoSelecionado === 'checkbox2'} onChange={aoAlterarCheckbox} name="checkbox2" />}
                label="SJF"
              />
              <FormControlLabel
                control={<Checkbox checked={algoritmoSelecionado === 'checkbox3'} onChange={aoAlterarCheckbox} name="checkbox3" />}
                label="SRT"
              />
            </div>
            <div className="checkbox-column">
              <FormControlLabel
                control={<Checkbox checked={algoritmoSelecionado === 'checkbox4'} onChange={aoAlterarCheckbox} name="checkbox4" />}
                label="RR"
              />
              <FormControlLabel
                control={<Checkbox checked={algoritmoSelecionado === 'checkbox5'} onChange={aoAlterarCheckbox} name="checkbox5" />}
                label="LJF"
              />
              <FormControlLabel
                control={<Checkbox checked={algoritmoSelecionado === 'checkbox6'} onChange={aoAlterarCheckbox} name="checkbox6" />}
                label="Prioridade"
              />
            </div>
          </div>

          <Button
            variant="contained"
            color="primary"
            className="run-button"
            onClick={executarSimulacao}
          >
            Executar Simulação
          </Button>
        </div>

        <div className="graph-container">
          {processosGerados.length > 0 && (
            <div className="process-list">
              <h4>Processos Gerados (ordem de chegada)</h4>
              <ul>
                {[...processosGerados]
                  .sort((a, b) => a.tempoChegada - b.tempoChegada)
                  .map((p) => (
                    <li key={p.id}>
                      <strong>{p.id}</strong> — chegada: <strong>{p.tempoChegada}</strong>, duração: <strong>{p.duracao}</strong>
                      {p.prioridade !== undefined && (
                        <> — prioridade: <strong>{p.prioridade}</strong></>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {algoritmoSelecionado === 'checkbox4' ? (
            blocosRR.length > 0 ? (
              <BarChart width={700} height={300} data={blocosRR}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip
                  formatter={(_, __, { payload }) => [`Início: ${payload.inicio}, Fim: ${payload.fim}`, 'Execução']}
                />
                <Bar dataKey={(data) => data.fim - data.inicio} name="Execução" fill="#ff884d">
                  <LabelList dataKey="inicio" position="insideTop" style={{ fill: 'white', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic' }}>Gráfico será exibido após a simulação RR.</p>
            )
          ) : algoritmoSelecionado === 'checkbox3' ? (
            blocosSRT.length > 0 ? (
              <BarChart width={700} height={300} data={blocosSRT}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip
                  formatter={(_, __, { payload }) => [`Início: ${payload.inicio}, Fim: ${payload.fim}`, 'Execução']}
                />
                <Bar dataKey={(data) => data.fim - data.inicio} name="Execução" fill="#82ca9d">
                  <LabelList dataKey="inicio" position="insideTop" style={{ fill: 'white', fontWeight: 'bold' }} />
                </Bar>
              </BarChart>
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic' }}>Gráfico será exibido após a simulação SRT.</p>
            )
          ) : algoritmoSelecionado === 'checkbox6' ? (
            resultados.length > 0 ? (
              <BarChart width={700} height={300} data={resultados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip
                  formatter={(_, __, { payload }) => [
                    `Início: ${payload.inicio}, Fim: ${payload.fim}, Espera: ${payload.tempoEspera}, Retorno: ${payload.tempoRetorno}, Prioridade: ${payload.prioridade ?? '—'}`,
                    'Detalhes',
                  ]}
                />
                <Bar dataKey={(data) => data.fim - data.inicio} name="Execução">
                  {resultados.map((index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        '#69c0ff'
                      }
                    />
                  ))}
                  <LabelList
                    dataKey="prioridade"
                    position="insideTop"
                    formatter={(value: number) => `Pr. ${value}`}
                    style={{ fill: 'white', fontWeight: 'bold' }}
                  />
                </Bar>
              </BarChart>
            ) : (
              <p style={{ color: '#999', fontStyle: 'italic' }}>Gráfico será exibido após a simulação de Prioridade.</p>
            )
          ) : resultados.length > 0 ? (
            <BarChart width={700} height={300} data={resultados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip
                formatter={(_, __, { payload }) => [
                  `Início: ${payload.inicio}, Fim: ${payload.fim}, Espera: ${payload.tempoEspera}, Retorno: ${payload.tempoRetorno}`,
                  'Detalhes',
                ]}
              />
              <Bar
                dataKey={(data) => data.fim - data.inicio}
                name="Duração"
                fill={
                  algoritmoSelecionado === 'checkbox1' ? '#7e30c2' :
                  algoritmoSelecionado === 'checkbox2' ? '#ffc658' :
                  algoritmoSelecionado === 'checkbox5' ? '#ffa940' :
                  '#8884d8'
                }
              >
                <LabelList dataKey="inicio" position="insideTop" style={{ fill: 'white', fontWeight: 'bold' }} />
              </Bar>
            </BarChart>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>Gráficos serão exibidos aqui após a simulação.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
