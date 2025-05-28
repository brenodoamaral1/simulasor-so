// components/GanttChart.tsx
import { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt';
import { ResultadoSimulacao } from '../scripts/tipos';

type GanttChartProps = {
  resultados: ResultadoSimulacao[];
};

function GanttChart({ resultados }: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const addMinutes = (min: number) => new Date(base.getTime() + min * 60 * 1000);

    const tasks = resultados.map((r) => ({
      id: `${r.id}-${r.inicio}`,
      name: r.id,
      start: addMinutes(r.inicio),
      end: addMinutes(r.fim),
      progress: 100,
    }));

    containerRef.current.innerHTML = '';

    new Gantt(containerRef.current, tasks, {
      view_mode: 'Quarter Day',
      custom_popup_html: (task: { name: string; _start: Date; _end: Date }) => `
        <div class="details-container">
          <strong>${task.name}</strong><br>
          Início: ${task._start.getMinutes()} min<br>
          Fim: ${task._end.getMinutes()} min
        </div>`,
    });
  }, [resultados]);

  return <div ref={containerRef} />;
}

export default GanttChart;