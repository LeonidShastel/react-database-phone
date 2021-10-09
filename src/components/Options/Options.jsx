import React, {useEffect, useState} from 'react';
import {Typography, Box, CircularProgress, Backdrop, Button, Alert, Snackbar} from "@mui/material";
import axios from "axios";
import AlertPopup from "../AlertPopup";

const Options = () => {
    const [loading, setLoading] = useState(true);
    const [alertType, setAlertType] =useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVision, setAlertVision] = useState(false);



    const clearBase = async () =>{
        return await axios.get('http://thelax67.beget.tech/options.php?option=database_clear')
            .then(response => {
                setAlertType('success');
                setAlertMessage("База данных удалена");
                setAlertVision(true);
                console.log(response.data);
            })
            .catch(error => {
                setAlertType("error");
                setAlertMessage(error.message);
                setAlertVision(true);
            })
            .finally(()=>setLoading(false));
    }

    useEffect(() => {
        setLoading(false)
    }, []);

    return (
        <div>
            <Box>
                <Typography variant={"h5"} sx={{color: '#1976D2', marginBottom: 5}}>Опции для работы с БД</Typography>
            </Box>
            <Box>
                <Typography variant={"h5"} sx={{color: '#1976D2', marginTop: 5, marginBottom: 2, borderBottom: 1}}>Кнопки управления</Typography>

            </Box>
            <Backdrop open={loading} sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <CircularProgress color={"inherit"}/>
            </Backdrop>
            <AlertPopup type={alertType} message={alertMessage} vision={alertVision} setVision={setAlertVision}/>
        </div>
    );
};

export default Options;