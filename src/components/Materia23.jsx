import { useState } from "react";
import { FormControlLabel, Checkbox, List, ListItem, Typography, Popover } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

function Materia23(props) {
  const {materiasPlan86, materia, checked} = props;

  const [popoverAnchor, setPopoverAnchor] = useState(null);

  const creditosExtraNecesarios = (equivalencia) => {
    return 0 - equivalencia.creditos
      - materiasPlan86.obligatorias.filter(m => equivalencia.materias.includes(m.nombre)).reduce((a, b) => a.creditosExtra??0 + b.creditosExtra??0, 0)
      - materiasPlan86.electivas.filter(m => equivalencia.materias.includes(m.nombre)).reduce((a, b) => a.creditosExtra??0 + b.creditosExtra??0, 0)
  }

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            onClick={e => e.preventDefault()}
            checked={checked}
          />
        }
        disableTypography={true}
        label={
          <>
            <Typography>{materia.nombre}</Typography>
            <InfoIcon onClick={(e) => setPopoverAnchor(e.currentTarget)} sx={{marginLeft: "0.4em"}} />
          </>
        }
      />
      <Popover
        open={popoverAnchor !== null}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        transformOrigin={{horizontal: "right", vertical: "top"}}
      >
        <List>
          {materia.equivalencias.map((equivalencia, idx) =>
            <ListItem key={`${materia.nombre}-23-equivalencia${idx}`} sx={{p: 2}}>
              {equivalencia.materias.join(' + ')}
              {creditosExtraNecesarios(equivalencia) > 0 && ` + ${creditosExtraNecesarios(equivalencia)} créditos`}
            </ListItem>
          )}
        </List>
      </Popover>
    </>
  );
}
    
export default Materia23;