import { Box } from '@mui/material';
import React from 'react';

function Top() {
    return (
        <Box
            px={{xs: 0, md: 2}}
            py={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            bgcolor="#0095db"
            >
            <img
                src={process.env.PUBLIC_URL + "/fiuba-white-logo.png"}
                alt={"Logo FIUBA"}
                style={{ width: 200, display: "block", padding: 10 }}
            />
            <span style={{
                padding: "0.5em 1.75em",
                borderLeft: "2px solid white",
                color: "white",
            }}>
                Secretaría de<br /><b>Gestión Académica</b>
            </span>
        </Box>
    )
}

export default React.memo(Top);