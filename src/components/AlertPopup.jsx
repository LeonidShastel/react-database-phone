import React from 'react';
import {Snackbar,Alert} from "@mui/material";

const AlertPopup = ({type, message, vision, setVision}) => {
    return (
        <Snackbar open={vision} onClose={() => setVision(false)}>
            <Alert severity={type} sx={{width: '100%'}}
                   onClose={() => setVision(false)}>{message}</Alert>
        </Snackbar>
    );
};

export default AlertPopup;