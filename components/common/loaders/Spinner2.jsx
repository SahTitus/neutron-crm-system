import { Box, CircularProgress } from '@mui/material'
import React from 'react'

const Spinner2 = () => {
    return (
        <Box className="flex items-center justify-center text-blue py-3 ">
            <CircularProgress
                className="text-blue"
                role="progressbar"
                id="combo"
                aria-label="loading data"
            />
        </Box>
    )
}

export default Spinner2;