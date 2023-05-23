import { FormControlLabel, Checkbox } from "@mui/material";

function Materia86(props) {
  const {materia, checked, onCheck, onUncheck} = props;
  
  return (
    <FormControlLabel
      control={
        <Checkbox
          onChange={(e) => (e.target.checked) ? onCheck(materia) : onUncheck(materia)}
          checked={checked}
        />
      }
      label={materia.nombre}
    />
  );
}
  
  export default Materia86;