import React from 'react';
import { FormGroup, TextField } from "@mui/material";

function ExtraCredits({ value, setValue, disabled }) {
    return (
        <FormGroup sx={{marginBottom: "1em"}}>
            <TextField
                type="number"
                value={value}
                onChange={e => setValue(parseInt((e.target.value) ? e.target.value : 0))}
                disabled={disabled}
                sx={{
                    backgroundColor: "white"
                }}
            />
        </FormGroup>
    )
}

export default React.memo(ExtraCredits);
