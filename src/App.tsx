import { ChangeEvent } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useState } from 'react';

function App() {
  const [selectedCheckbox, setSelectedCheckbox] = useState<string | null>(null);

  // Tipo de evento alterado para ChangeEvent
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.name;
    setSelectedCheckbox(selectedCheckbox === value ? null : value); // Alternar a seleção
  };

  return (
    <>
      <div>
        <h1>Simulação de Sistema Operacional</h1>
      </div>
      <div>
      <TextField
        id="outlined-number"
        label="Insira a quantidade de processos"
        type="number"
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        inputProps={{
          min: 0, // Limita o valor mínimo para 0
          max: 10, // Limita o valor máximo para 10
          step: 1, // Define o passo de incremento/decremento como 1
        }}
      />
        <FormGroup className='FormGroup'>
          <h3>Selecione o algoritmo de escalonamento:</h3>
          <FormControlLabel 
            className = 'FormControlLabel' 
            control={<Checkbox 
            checked={selectedCheckbox === 'checkbox1'} 
            onChange={handleCheckboxChange} 
            name="checkbox1" 
          />} 
            label="FIFO" 
          />
          <FormControlLabel 
            className = 'FormControlLabel' 
            control={<Checkbox 
            checked={selectedCheckbox === 'checkbox2'} 
            onChange={handleCheckboxChange} 
            name="checkbox2" 
          />} 
            label="SJF" 
          />
          <FormControlLabel 
            className = 'FormControlLabel' 
            control={<Checkbox 
            checked={selectedCheckbox === 'checkbox3'} 
            onChange={handleCheckboxChange} 
            name="checkbox3" 
          />} 
            label="SRT" 
          />
          <FormControlLabel 
            className = 'FormControlLabel' 
            control={<Checkbox 
            checked={selectedCheckbox === 'checkbox4'} 
            onChange={handleCheckboxChange} 
            name="checkbox4" 
          />} 
            label="RR" 
          />
          <FormControlLabel 
            className = 'FormControlLabel' 
            control={<Checkbox 
            checked={selectedCheckbox === 'checkbox5'} 
            onChange={handleCheckboxChange} 
            name="checkbox5" 
          />} 
            label="Múltiplas Filas" 
          />
        </FormGroup>
        <FormGroup className='FormGroup'>
          <h3>Selecione o tipo de alocação de memória:</h3>
          <FormControlLabel 
            className = 'FormControlLabel' 
            control={<Checkbox 
            checked={selectedCheckbox === 'checkbox1'} 
            onChange={handleCheckboxChange} 
            name="checkbox1" 
          />} 
            label="Label1" 
          />
          <FormControlLabel 
            className = 'FormControlLabel' 
            control={<Checkbox 
            checked={selectedCheckbox === 'checkbox2'} 
            onChange={handleCheckboxChange} 
            name="checkbox2" 
          />} 
            label="Label2" 
          />
          <FormControlLabel 
            className = 'FormControlLabel' 
            control={<Checkbox 
            checked={selectedCheckbox === 'checkbox3'} 
            onChange={handleCheckboxChange} 
            name="checkbox3" 
          />} 
            label="Label3" 
          />
        </FormGroup>
        <Button
          variant="contained"
          color="primary"
          sx={{
            marginTop: '2rem',
            fontSize: '2vh',
            borderRadius: '1vh',
            width: '100%',
            height: '6vh',
            backgroundColor: '#8E44AD',
            '&:hover': {
              backgroundColor: '#2980B9',
            },
          }}
        >
          
          Executar Simulação
        </Button>
      </div>
    </>
  );
}

export default App;
