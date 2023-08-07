import React from 'react';
import { Checkbox, FormControlLabel } from "@mui/material";

function Canje({materia, aprobada, disponible, checked, onCheck, onUncheck}) {
    const handleChange = (e) => {
        if (e.target.checked) {
            onCheck(materia);
        } else {
            onUncheck(materia);
        }
    }
    
    return (
        <FormControlLabel
            control={
                <Checkbox
                    onChange={handleChange}
                    checked={checked}
                    disabled={aprobada || !disponible}
                />
            }
            label={
                aprobada ?
                materia.nombre :
                <>
                {materia.nombre} <b>({materia.canjeable} créditos)</b>
                </>
            }
            title={aprobada ? "Aprobada por otras equivalencias" : !disponible ? "No te sobran suficientes créditos" : ""}
        />
    )
}

export default React.memo(Canje);
