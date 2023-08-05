import { FormControlLabel, Checkbox } from "@mui/material";
import React, { useState, useEffect } from "react";

function Materia86(props) {
  const {materia, checked, onCheck, onUncheck, disabled} = props;
  const [fakeClicked, setFakeClicked] = useState(false);

  useEffect(() => {
    let timeout;
    if (fakeClicked) {
      timeout = setTimeout(() => {
        setFakeClicked(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    }
  }, [fakeClicked]);


  const handleCheck = (e) => {
    if(disabled) {
      setFakeClicked(true);
      return;
    }
    if (e.target.checked) {
      onCheck(materia);
    } else {
      onUncheck(materia);
    }
  };

  const label = fakeClicked ? "Estas en modo lectura chinchulin!" : materia.nombre;
  
  return (
    <FormControlLabel
      control={
        <Checkbox
          onChange={handleCheck}
          checked={checked}
          disabled={fakeClicked}
        />
      }
      label={label}
    />
  );
}
  
 export default React.memo(Materia86);
