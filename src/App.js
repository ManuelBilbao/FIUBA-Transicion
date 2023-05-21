import './App.css';
import { Checkbox, FormGroup, FormControlLabel, FormLabel, Grid, Paper, Box, Button } from '@mui/material';
import materias_plan86 from "./plan_86.json";
import materias_plan23 from "./plan_23.json";
import { useEffect, useState } from 'react';
import { useMaterias86 } from './utils/useMaterias86';
import DeleteIcon from '@mui/icons-material/Delete';
import SnowboardingIcon from '@mui/icons-material/Snowboarding';

function App() {
  const [creditos, setCreditos] = useState(0);
  const [creditosDirectos, setCreditosDirectos] = useState(0);
  const [creditosTransicion, setCreditosTransicion] = useState(0);
  const [materias86, setMaterias86] = useMaterias86("materias86-calculadorBilbao", []);
  const [materias23, setMaterias23] = useState([]);

  const agregarMateria86 = (materia) => {
    setMaterias86(materias86.concat(materia));
  };
  const seleccionarTodasObligatorias86 = () => {
    setMaterias86(materias_plan86.obligatorias);
  };
  const limpiarTodo = () => {
    setMaterias86([]);
    setCreditosDirectos(0);
    setCreditosTransicion(0);
    setCreditos(0);
    setMaterias23([]);
  };

  const eliminarMateria86 = (materia) => {
    setMaterias86(materias86.filter(m => m.nombre !== materia.nombre));
  };

  const handleCheck = (e, materia) => {
    if (e.target.checked) {
      agregarMateria86(materia);
      setCreditosDirectos(creditosDirectos + materia.creditosExtra);
    } else {
      eliminarMateria86(materia);
      setCreditosDirectos(creditosDirectos - materia.creditosExtra);
    }
  };

  useEffect(() => {
    let _materias23 = [];
    let _creditos = 0;
    let taller2Usada = false;

    const tieneMaterias = (materias) => {
      return materias.every(materia => materias86.map(m => m.nombre).includes(materia))
    };

    materias_plan23.map(materia => {
      // eslint-disable-next-line
      if (materia.equivalencias === undefined) return;

      for (let i = 0; i < materia.equivalencias.length; i++) {
        if (taller2Usada && materia.equivalencias[i].materias.includes("Taller de Programación II"))
          continue;

        if (tieneMaterias(materia.equivalencias[i].materias)) {
          _materias23.push(materia.nombre);
          _creditos += materia.equivalencias[i].creditos;

          if (materia.equivalencias[i].materias.includes("Taller de Programación II"))
            taller2Usada = true;

          break;
        }
      }

      // eslint-disable-next-line
      return;
    });
    setMaterias23(_materias23);
    setCreditosTransicion(_creditos);
  }, [materias86]);

  useEffect(() => {
    setCreditos(creditosDirectos + creditosTransicion);
  }, [creditosDirectos, creditosTransicion]);

  useEffect(() => {
    if (!materias86 || materias86.length === 0) return;
    setCreditosDirectos(materias86.map(materia => materia.creditosExtra).reduce((a, b) => a + b));
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{flexGrow: 1}} padding={2}>
      <Grid container sx={{ margin: "0 0 2rem 0" }}>
        <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
          <Paper elevation={3} sx={{padding: "1em"}}>
            <h3>Calculadora transición plan 86 a 2023</h3>
            <FormGroup>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<SnowboardingIcon />}
                sx={{ maxWidth: "300px", marginBottom: "1em" }}
                onClick={seleccionarTodasObligatorias86}
              >
                Aprobar obligatorias
              </Button>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                sx={{ maxWidth: "300px" }}
                onClick={limpiarTodo}
              >
                Limpiar todo
              </Button>
            </FormGroup>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{padding: "1em", marginBottom: "2em"}}>
            <h2>Obligatorias</h2>
            <FormGroup>
              {materias_plan86.obligatorias.map((materia, idx) =>
                <FormControlLabel
                  key={`${materia.nombre}-86`}
                  control={<Checkbox onChange={(e) => handleCheck(e, materia)} checked={materias86.some(m => m.nombre === materia.nombre)} />}
                  label={materia.nombre}
                />
              )}
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                label="Seleccionar todas las obligatorias"
                control={
                  <Checkbox
                    onClick={e => e.preventDefault()}
                    />
                }
              />
            </FormGroup>
          </Paper>
          <Paper elevation={3} sx={{padding: "1em", marginBottom: "2em"}}>
            <h2>Orientación</h2>
            {materias_plan86.orientaciones.map((orientacion, idx) =>
              <FormGroup key={orientacion.nombre} sx={{marginBottom: "1em"}}>
                <FormLabel>{orientacion.nombre}</FormLabel>
                {orientacion.materias.map((materia, idx) =>
                  <FormControlLabel
                    key={`${materia.nombre}-86`}
                    control={<Checkbox onChange={(e) => handleCheck(e, materia)} checked={materias86.some(m => m.nombre === materia.nombre)}/>}
                    label={materia.nombre}
                  />
                )}
              </FormGroup>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{padding: "1em"}}>
            <h2>Electivas</h2>
            <FormGroup>
              {materias_plan86.electivas.map(materia =>
                <FormControlLabel
                  key={`${materia.nombre}-86`}
                  control={<Checkbox onChange={e => handleCheck(e, materia)} checked={materias86.some(m => m.nombre === materia.nombre)}/>}
                  label={materia.nombre}
                />
              )}
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{padding: "1em"}}>
            <h2>Plan 2023</h2>
            <FormGroup>
              {materias_plan23.map(materia =>
                <FormControlLabel
                  key={`${materia.nombre}-23`}
                  control={
                    <Checkbox
                      onClick={e => e.preventDefault()}
                      checked={materias23.includes(materia.nombre)}
                    />
                  }
                  label={materia.nombre}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={e => e.preventDefault()}
                    indeterminate={creditos > 0 && creditos < 24}
                    checked={creditos >= 24}
                  />
                }
                label={`Electivas: ${(creditos <= 24) ? creditos : 24}/24`}
              />
            </FormGroup>
            {
              (creditos > 24) ?
              `Créditos sobrantes: ${creditos - 24}` :
              null
            }
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
