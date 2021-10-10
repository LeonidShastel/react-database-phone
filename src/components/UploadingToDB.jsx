import React, {createRef, useEffect, useState} from 'react';
import {CSVReader} from "react-papaparse";
import {
    Button,
    Box,
    TextField,
    Backdrop,
    CircularProgress,
    RadioGroup,
    FormLabel, FormControlLabel, Radio, FormControl
} from "@mui/material";
import axios from "axios";
import AlertPopup from "./AlertPopup";

const UploadingToDB = () => {

    const [file, setFile] = useState([]);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(true);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVision, setAlertVision] = useState(false);
    const [selectedBase, setSelectedBase] = useState(null);
    const [baseCities, setBaseCities] = useState([]);

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

    const getCities = async () => {
        setBaseCities([]);
        return await axios.get(`http://thelax67.beget.tech/options.php?option=cities`)
            .then(response => {
                setBaseCities(response.data)
            })
            .catch(error => {
                setAlertType('error');
                setAlertMessage(error.message);
            })
            .finally(() => setLoading(false))
    }


    const handleOnRemoveFile = (data) => {

    }

    useEffect(() => {
        getCities();
    }, [])

    const pushData = async () => {
        setLoading(true);
        const request = {'numbers': file, 'city': selectedBase===null ? country.toLowerCase() + "_" + city.toLowerCase() : baseCities[selectedBase].title};
        console.log(request)
        return await axios.post('http://thelax67.beget.tech/addToDataBase.php', request)
            .then(response => {
                setAlertType('success');
                setAlertMessage(`База данных обновлена. Дубликатов найдено: ${response.data}`);
                setAlertVision(true);
            })
            .catch(error => {
                setAlertType("error");
                setAlertMessage(error.message);
                setAlertVision(true);
            })
            .finally(() => setLoading(false));
    }

    return (
        <Box sx={{display: 'flex'}}>
            <Box>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Выберите базу для сохранения и проверки на дубликаты</FormLabel>
                    <RadioGroup
                        aria-label="base"
                        name="radio-buttons-group"
                        value={selectedBase}
                        onChange={e => setSelectedBase(e.target.value)}
                    >
                        {baseCities.map((el, index) => <FormControlLabel
                            value={index}
                            control={<Radio/>}
                            disabled={country !== '' || city !== ''}
                            label={`${el.title.split('_').join(' ').split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ')}`}/>)}
                    </RadioGroup>
                </FormControl>
                <Box sx={{marginTop: 5, display: 'flex', flexDirection: 'column'}}>
                    <FormLabel component="legend">Для создания новой таблицы введите данные</FormLabel>
                    <Box style={{marginTop: 5}}>
                        <TextField size={"small"} value={country} onChange={e => {setSelectedBase(null); setCountry(e.target.value)}}
                                   sx={{marginRight: 2}} label={"Страна"} required={true}/>
                        <TextField size={"small"} value={city} onChange={e => {setSelectedBase(null); setCity(e.target.value)}}
                                   sx={{marginRight: 10}} label={"Город"} required={true}/>
                    </Box>
                </Box>
            </Box>
            <Box>
                <FormLabel component="legend">Выберите .csv файл</FormLabel>
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
                            <TextField size={"medium"} disabled value={file && file.name} variant={"standard"}
                                       sx={{width: "30%"}}/>
                        </Box>
                    )}
                </CSVReader>
                <Button onClick={pushData}
                        disabled={!((selectedBase === null && (country !== '' && city !== '')) || (selectedBase !== null && (country === '' && city === '')))}
                        variant={"outlined"}>Загрузить</Button>
            </Box>
            <Backdrop open={loading} sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <CircularProgress color={"inherit"}/>
            </Backdrop>
            <AlertPopup type={alertType} message={alertMessage} vision={alertVision} setVision={setAlertVision}/>
        </Box>
    );
};

export default UploadingToDB;