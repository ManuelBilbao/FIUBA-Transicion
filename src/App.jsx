import './App.css';
import { Checkbox, FormGroup, FormControlLabel, FormLabel, Grid, Paper, Box, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useMaterias86 } from './utils/useMaterias86';
import Materia86 from './components/Materia86';
import Materia23 from './components/Materia23';
import ShareDialog from './components/ShareDialog';
import ExtraCredits from './components/ExtraCredits';
import Header from './components/Header/Header';
import { useExtraCredits } from './utils/useExtraCredits';
import { useCanje } from './utils/useCanje';
import Canje from './components/Canje';
import { SLUG_CARRERA } from './config';

const MATERIAS_PLAN_VIEJO = await import(`./planes/${SLUG_CARRERA}/plan_viejo.json`);
const {
  creditosElectivas: CREDITOS_ELECTIVAS_NUEVO,
  materias: MATERIAS_PLAN_NUEVO
} = await import(`./planes/${SLUG_CARRERA}/plan_nuevo.json`);

const MIN_CREDITOS_CANJE =
  MATERIAS_PLAN_NUEVO.filter(m => m.canjeable).length &&
  MATERIAS_PLAN_NUEVO.map(m => m.canjeable ?? 99).reduce((a, b) => Math.min(a, b));


function App() {
  const [creditosTotales, setCreditosTotales] = useState(0);
  const [creditosDirectos, setCreditosDirectos] = useState(0);  // Créditos porn materias aprobadas sin equivalencias
  const [creditosTransicion, setCreditosTransicion] = useState(0);  // Créditos extra por la transición
  const [creditosCanje, setCreditosCanje] = useState(0);
  const [creditosExtra, setCreditosExtra] = useExtraCredits("xcredits", 0);

  const [materias86, setMaterias86, readOnly] = useMaterias86("materias86-calculadorBilbao2", []);
  const [materias23, setMaterias23] = useState([]);
  const [materiasCanjeadas, setMateriasCanjeadas] = useCanje("canje", []);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [canjeShareCode, setCanjeShareCode] = useState("");


  const agregarMateria86 = useCallback((materia) => {
    setMaterias86(materias =>
      materias.includes(materia) ? materias : materias.concat(materia)
    );
  }, [setMaterias86]);

  const agregarMaterias86 = useCallback((materias_nuevas) => {
    setMaterias86(materias => {
      const nuevas_filtradas = materias_nuevas.filter(
        materia => !materias.map(m => m.nombre).includes(materia.nombre)
      );

      if (nuevas_filtradas.length === 0) return materias;
      
      return materias.concat(nuevas_filtradas);
    });
  }, [materias86, setMaterias86]);

  const seleccionarTodasObligatorias86 = () => {
    agregarMaterias86(MATERIAS_PLAN_VIEJO.obligatorias);
  };

  const eliminarMateria86 = useCallback((materia) => {
    setMaterias86(materias => materias.filter(m => m.nombre !== materia.nombre));
  }, [setMaterias86]);

  const limpiarTodo = () => {
    setMaterias86([]);
    setCreditosDirectos(0);
    setCreditosTransicion(0);
    setCreditosTotales(0);
    setMaterias23([]);
    setCreditosExtra(0);
  };

  const compartir = () => {
    let bits = "";
    let hexa = "";

    MATERIAS_PLAN_VIEJO.obligatorias.forEach(materia => {
      bits += (materias86.some(m => m.nombre === materia.nombre)) ? "1" : "0";
    });

    MATERIAS_PLAN_VIEJO.orientaciones.forEach(orientacion => {
      orientacion.materias.forEach(materia => {
        bits += (materias86.some(m => m.nombre === materia.nombre)) ? "1" : "0";
      });
    });

    MATERIAS_PLAN_VIEJO.electivas.forEach(materia => {
      bits += (materias86.some(m => m.nombre === materia.nombre)) ? "1" : "0";
    });

    for (let i = 0; i < bits.length; i += 4) {
      hexa += parseInt(bits.slice(i, i + 4), 2).toString(16);
    }

    setShareCode(hexa);

    bits = "";
    hexa = "";

    MATERIAS_PLAN_NUEVO.forEach(materia => {
      bits += (materiasCanjeadas.some(m => m === materia.nombre)) ? "1" : "0";
    });

    for (let i = 0; i < bits.length; i += 4) {
      hexa += parseInt(bits.slice(i, i + 4), 2).toString(16);
    }

    setCanjeShareCode(hexa);
    setShareDialogOpen(true);
  }

  useEffect(() => {
    let _materias23 = [];
    let creditos_transicion = 0;
    let materias_usadas = [];

    const creditos86 = materias86.map(m => m.creditos).reduce((a, b) => a + b, 0);

    const tieneMaterias = (materias) => {
      return materias.every(materia => materias86.map(m => m.nombre).includes(materia))
    };

    MATERIAS_PLAN_NUEVO.forEach(materia => {
      if (materia.equivalencias === undefined) return;

      for (let i = 0; i < materia.equivalencias.length; i++) {
        // Si se puede canjear por créditos del plan viejo
        if (
          materia.equivalencias[i].creditosNecesarios !== undefined &&
          materia.equivalencias[i].creditosNecesarios <= creditos86
        ) {
          _materias23.push(materia.nombre);
          break;
        }

        // Puede que no tenga equivalencias del plan viejo, o que no alcanzan los créditos del if anterior
        if (materia.equivalencias[i].materias.length === 0)
          continue;

        // Si necesita una materia que ya fue usada, no la considero
        if (materia.equivalencias[i].materias.some(m => materias_usadas.includes(m.nombre)))
          continue;

        if (tieneMaterias(materia.equivalencias[i].materias)) {
          _materias23.push(materia.nombre);
          creditos_transicion += materia.equivalencias[i].creditosExtra ?? 0;

          materias_usadas = materias_usadas.concat(materia.equivalencias[i].materias);

          break;
        }
      }
    });

    const creditos_directos = materias86
      .filter(materia => !materias_usadas.includes(materia.nombre))
      .map(materia => materia.creditos)
      .reduce((a, b) => a + b, 0)

    setCreditosDirectos(creditos_directos);
    setCreditosTransicion(
      creditos_transicion + materias86
        .map(materia => materia.creditosExtra ?? 0)
        .reduce((a, b) => a + b, 0)
    );

    setMaterias23(_materias23);
    setMateriasCanjeadas(canjeadas => canjeadas.filter(m => !_materias23.includes(m)))

    if (creditos_directos + creditos_transicion + creditosExtra < CREDITOS_ELECTIVAS_NUEVO + creditosCanje) {
      setMateriasCanjeadas([]);
    }
  }, [materias86, creditosCanje, creditosExtra, setMateriasCanjeadas]);

  useEffect(() => {
    setCreditosTotales(creditosDirectos + creditosExtra + creditosTransicion);
  }, [creditosDirectos, creditosExtra, creditosTransicion]);

  useEffect(() => {
    setCreditosCanje(MATERIAS_PLAN_NUEVO.filter(m => materiasCanjeadas.includes(m.nombre)).map(m => m.canjeable).reduce((a, b) => a + b, 0));
  }, [materiasCanjeadas]);

  return (
    <>
      <Header
        aprobarObligatorias={seleccionarTodasObligatorias86}
        limpiar={limpiarTodo}
        compartir={compartir}
        readOnly={readOnly}
      />

      <ShareDialog codigo={shareCode} creditos={creditosExtra} canje={canjeShareCode} open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} />

      <Box sx={{ flexGrow: 1 }} padding={2} marginTop={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ padding: "3em", marginBottom: "2em" }}>
              <h3>Obligatorias</h3>
              <FormGroup>
                {MATERIAS_PLAN_VIEJO.obligatorias.map((materia, idx) =>
                  <Materia86
                    key={`${materia.nombre}-86`}
                    materia={materia}
                    checked={materias86.some(m => m.nombre === materia.nombre)}
                    onCheck={agregarMateria86}
                    onUncheck={eliminarMateria86}
                    disabled={readOnly}
                  />
                )}
              </FormGroup>
            </Paper>

            { MATERIAS_PLAN_VIEJO.orientaciones.length > 0 ?
            <Paper elevation={0} sx={{ padding: "3em", marginBottom: "2em" }}>
              <h3>Orientación</h3>
              {MATERIAS_PLAN_VIEJO.orientaciones.map((orientacion, idx) =>
                <FormGroup key={orientacion.nombre} sx={{ marginBottom: "1em" }}>
                  <FormLabel>{orientacion.nombre}</FormLabel>
                  {orientacion.materias.map((materia, idx) =>
                    <Materia86
                      key={`${materia.nombre}-86`}
                      materia={materia}
                      checked={materias86.some(m => m.nombre === materia.nombre)}
                      onCheck={agregarMateria86}
                      onUncheck={eliminarMateria86}
                      disabled={readOnly}
                    />
                  )}
                </FormGroup>
              )}
            </Paper>
            : null}

            <Paper elevation={0} sx={{ padding: "3em", marginBottom: "2em" }}>
              <h3>Créditos extra</h3>
              <ExtraCredits value={creditosExtra} setValue={setCreditosExtra} disabled={readOnly} />
              <Typography variant='caption'>Agregá acá si tenés créditos extra obtenidos por fuera del plan.</Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ padding: "3em", marginBottom: "2em" }}>
              <h3>Electivas</h3>
              <FormGroup>
                {MATERIAS_PLAN_VIEJO.electivas.map(materia =>
                  <Materia86
                    key={`${materia.nombre}-86`}
                    materia={materia}
                    checked={materias86.some(m => m.nombre === materia.nombre)}
                    onCheck={agregarMateria86}
                    onUncheck={eliminarMateria86}
                    disabled={readOnly}
                  />
                )}
              </FormGroup>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ padding: "3em", marginBottom: "2em" }}>
              <h3>Plan 2023</h3>
              <FormGroup>
                {MATERIAS_PLAN_NUEVO.map(materia =>
                  <Materia23
                    key={`${materia.nombre}-23`}
                    materia={materia}
                    checked={materias23.includes(materia.nombre) || materiasCanjeadas.includes(materia.nombre)}
                  />
                )}
                <FormControlLabel
                  control={
                    <Checkbox
                      onClick={e => e.preventDefault()}
                      indeterminate={creditosTotales > 0 && creditosTotales < CREDITOS_ELECTIVAS_NUEVO}
                      checked={creditosTotales >= CREDITOS_ELECTIVAS_NUEVO}
                    />
                  }
                  label={`Electivas: ${(creditosTotales <= CREDITOS_ELECTIVAS_NUEVO) ? creditosTotales : CREDITOS_ELECTIVAS_NUEVO}/${CREDITOS_ELECTIVAS_NUEVO}`}
                />
              </FormGroup>
              {
                (creditosTotales > CREDITOS_ELECTIVAS_NUEVO) ?
                  `Créditos sobrantes: ${creditosTotales - CREDITOS_ELECTIVAS_NUEVO - creditosCanje}` :
                  null
              }
            </Paper>

            {MIN_CREDITOS_CANJE && creditosTotales >= CREDITOS_ELECTIVAS_NUEVO + MIN_CREDITOS_CANJE ?
              <Paper elevation={0} sx={{ padding: "3em", marginBottom: "2em" }}>
                <h3>Canje por trayectoria académica</h3>
                <Typography variant='caption'>Si ves esto es porque te sobran {MIN_CREDITOS_CANJE} o más créditos. En este caso, podés elegir alguna(s) de las siguientes materias para canjear por esos créditos.</Typography>
                <FormGroup>
                  {MATERIAS_PLAN_NUEVO.filter(m => m.canjeable).map(materia =>
                    <Canje
                      key={`${materia.nombre}-23-canje`}
                      materia={materia}
                      checked={materiasCanjeadas.includes(materia.nombre) || materias23.includes(materia.nombre)}
                      aprobada={materias23.includes(materia.nombre)}
                      disponible={
                        (
                          creditosTotales - creditosCanje - CREDITOS_ELECTIVAS_NUEVO >= materia.canjeable
                          || materiasCanjeadas.includes(materia.nombre)
                        ) && !readOnly
                      }
                      onCheck={(m) => setMateriasCanjeadas(materiasCanjeadas.concat(m.nombre))}
                      onUncheck={(m) => setMateriasCanjeadas(materiasCanjeadas.filter(mat => mat !== m.nombre))}
                    />
                  )}
                </FormGroup>
              </Paper>
              : null
            }
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default App;
