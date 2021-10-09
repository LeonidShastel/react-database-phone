import React, {createRef, useState} from 'react';
import {CSVReader} from "react-papaparse";
import {Button, Box, TextField, Typography, Backdrop, CircularProgress, Alert, Snackbar} from "@mui/material";
import axios from "axios";

const UploadingToDB = () => {

    const [file, setFile] = useState([]);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [alertType, setAlertType] =useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVision, setAlertVision] = useState(false);

    const buttonRef = createRef();

    const handleOpenDialog = (e) => {
        if (buttonRef.current) {
            buttonRef.current.open(e)
        }
    }

    const handleOnFileLoad = (data) => {
        const bodyNum = [];
        const promice = new Promise((resolve) => {
            resolve(
                data.forEach(e => {
                    if (+e.data[0])
                        bodyNum.push(e.data[0])
                })
            )
        })
            .then((value) => {
                console.log(value);
                setFile(bodyNum);
            })
    }

    const handleOnError = (err, file, inputElem, reason) => {
        console.log(err)
    }

    const handleOnRemoveFile = (data) => {

    }

    const pushData = async () => {
        setLoading(true);
        const request = {'numbers': file, 'city': country.toLowerCase()+"_"+city.toLowerCase()} ;
        return await axios.post('http://thelax67.beget.tech/addToDataBase.php', request)
            .then(response => {
                setAlertType('success');
                setAlertMessage("База данных обновлена");
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

    return (
        <div>
            <Typography variant={"h5"} sx={{color: '#1976D2', marginBottom: 10}}>Выберите .csv файл и введите название города для загрузки</Typography>
            <CSVReader
                ref={buttonRef}
                onFileLoad={handleOnFileLoad}
                onError={handleOnError}
                noClick
                noDrag
                onRemoveFile={handleOnRemoveFile}
            >
                {({file}) => (
                        <Box sx={{display: 'flex'}}>
                            <Button onClick={handleOpenDialog}>Выбрать файл</Button>
                            <TextField size={"medium"} disabled value={file&&file.name} variant={"standard"} sx={{width: "30%"}}/>
                        </Box>
                )}
            </CSVReader>
            <Box sx={{marginTop: 5, display: 'flex'}}>
                <TextField size={"small"} value={country} onChange={e=>setCountry(e.target.value)} sx={{marginRight: 2}} placeholder={"Страна"} required={true}/>
                <TextField size={"small"} value={city} onChange={e=>setCity(e.target.value)} sx={{marginRight: 10}} placeholder={"Город"} required={true}/>
                <Button onClick={pushData} disabled={city===''||country===''} variant={"outlined"}>Загрузить</Button>
            </Box>
            <Backdrop open={loading}   sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color={"inherit"}/>
            </Backdrop>
            <Snackbar open={alertVision} onClose={()=>setAlertVision(false)}>
                <Alert severity={alertType} sx={{ width: '100%' }} onClose={()=>setAlertVision(false)}>{alertMessage}</Alert>
            </Snackbar>
        </div>
    );
};

export default UploadingToDB;