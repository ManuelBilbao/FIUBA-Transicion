import { Box } from '@mui/material';
import { NOMBRE_CARRERA } from '../../config';
import React from 'react';

function Hero() {
    return (
        <Box
            px="1em"
            py="3em"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            color="white"
            sx={{
                background: `url(${import.meta.env.BASE_URL}banner_recortado.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <h1>Calculadora Plan 2023</h1>
            <h2>{ NOMBRE_CARRERA }</h2>
        </Box>
    )
}

export default React.memo(Hero);