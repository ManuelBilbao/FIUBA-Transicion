import { Button as MuiButton } from '@mui/material';
import React from 'react';

function Button({ text, onClick }) {
    return (
        <MuiButton
            variant='contained'
            disableElevation
            color='grey'
            sx={{
                margin: "0.75em",
                padding: "0.5em 3em",
                fontWeight: "bold",
                fontSize: "1em",
                textTransform: "none",
                minWidth: "20em"
            }}
            onClick={onClick}
        >
            {text}
        </MuiButton>
    )
}

export default React.memo(Button);