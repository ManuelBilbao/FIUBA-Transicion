import { Box } from '@mui/material';
import React from 'react';
import Button from './Button';

function ButtonsWrapper(props) {
    const {aprobarObligatorias, limpiar, compartir, readOnly} = props;

    return (
        <Box
            p={2}
            bgcolor="#e19800"
            textAlign="center"
        >
            {readOnly ? 
            <Button
                text="Modo lectura"
                onClick={() => {}}
            />
            :
                <>
                    <Button
                        text="Aprobar obligatorias"
                        onClick={aprobarObligatorias}
                    />
                    <Button
                        text="Limpiar todo"
                        onClick={limpiar}
                    />
                </>
            }
            <Button
                text="Compartir"
                onClick={compartir}
            />
        </Box>
    )
}

export default React.memo(ButtonsWrapper);