import React, {useEffect, useState} from 'react';
import {
    Alert,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Snackbar,
    TextField,
    Typography,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio
} from "@mui/material";
import axios from "axios";
import {useCookies} from "react-cookie";

const GetDump = ({privileges}) => {
    const [selectedBase, setSelectedBase] = useState(null);
    const [count, setCount] = useState('');
    const [urlDownload, setUrlDownload] = useState('');
    const [loading, setLoading] = useState(true);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVision, setAlertVision] = useState(false);
    const [baseCities, setBaseCities] = useState([]);

    //if login user
    const [cookies] = useCookies();
    const [user, setUser] = useState({});
    const [access, setAccess] = useState([]);
    const getCurrentUser = async () => {
        return await axios.get(`http://thelax67.beget.tech/options.php?option=currentUser&email=${cookies.email}`)
            .then(response => {
                setUser(response.data)
                console.log(response.data)
                setAccess(JSON.parse(response.data.ACCESS_CITIES))
            })
            .catch(error => {
                setAlert('error', error.message, true);
            })
            .finally(() => setLoading(false))
    }

    const setAlert = (type, message, vision = true) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertVision(vision);
    }

    const getCities = async () => {
        return await axios.get(`http://thelax67.beget.tech/options.php?option=cities`)
            .then(response => {
                response.data.map(el => {
                    setBaseCities(prevArray => [...prevArray, el])
                })
            })
            .catch(error => {
                setAlert('error', error.message, true);
            })
            .finally(() => setLoading(false))
    }


    useEffect(() => {
        getCities();
        if(privileges!=='admin')
            getCurrentUser();
    }, []);

    const getFile = async () => {
        setLoading(true);
        return await axios.get(`http://thelax67.beget.tech/dumpBase.php?count=${count}&city=${baseCities[selectedBase].title}`)
            .then(response => {
                if (response.data !== "not auth") {
                    setAlert('success', 'Файл получен', true);
                    setUrlDownload(response.data);
                } else {
                    setAlert('error', 'Аутентификация не пройдена');
                }
            })
            .catch(error => {
                setAlert('error', 'Количество номеров не удалось получить', true);
            })
            .finally(() => setLoading(false));
    }
    const setValueRadio = (title) =>{
        for (let i=0; i<baseCities.length; i++)
            if(baseCities[i].title===title){
                return i;
            }
        return false;
    }

    const renderTableAdmin = (
        <>
            <FormControl component="fieldset">
                <FormLabel component="legend">Базы</FormLabel>
                <RadioGroup
                    aria-label="base"
                    name="radio-buttons-group"
                    value={selectedBase}
                    onChange={e => setSelectedBase(e.target.value)}
                >
                    {baseCities.map((el, index) => <FormControlLabel
                        value={index}
                        control={<Radio/>}
                        label={`${el.title.split('_').join(' ').split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ')}: в базе: ${el.numberPhones}; доступно для выгрузки: ${el.numberAvailablePhones}`}/>)}
                </RadioGroup>
            </FormControl>
            <TextField size={"small"} type={"number"} value={count} onChange={e => setCount(e.target.value)}
                       sx={{marginRight: 2}} placeholder={"Количество номеров"} required={true}/>
        </>
    )
    const renderTableUser = (
        access.length !== 0 ?
            <>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Базы</FormLabel>
                    <RadioGroup
                        aria-label="base"
                        name="radio-buttons-group"
                        value={selectedBase}
                        onChange={e => setSelectedBase(e.target.value)}
                    >
                        {access.map((el, index) => <FormControlLabel
                            key={index}
                            value={setValueRadio(el.city)}
                            control={<Radio/>}
                            label={`${el.city.split('_').join(' ').split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ')}: доступно для выгрузки: ${el.count}`}/>)}
                    </RadioGroup>
                </FormControl>
                <TextField size={"small"} type={"number"} value={count} onChange={e => setCount(e.target.value)}
                           sx={{marginRight: 2}} placeholder={"Количество номеров"} required={true}/>
            </>
            : <Typography>Доступа к базам для данного пользователя нет. Обратитесь к администратору.</Typography>
    )

    return (
        <Box>
            <Typography variant={"h5"} sx={{color: '#1976D2', marginBottom: 5}}>Введите количество номеров, страну и
                город для выгрузки. Уровень
                доступа: {privileges === 'admin' ? 'администратор' : 'пользователь'}</Typography>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
                {baseCities.length !== 0 ? <>
                    {privileges === 'admin' ? renderTableAdmin : user ? renderTableUser : null}
                    {privileges === 'admin' || access.length!==0 ? <Button onClick={getFile} variant={"outlined"} disabled={!selectedBase}>Получить файл</Button> : null}
                </> : <Box>Базы номеров отсутствуют</Box>}

            </Box>
            <Box>
                {urlDownload ? <Button variant={"outlined"}><a style={{textDecoration: 'none'}} href={urlDownload}
                                                               download={true}>Скачать</a></Button> : null}
            </Box>
            <Backdrop open={loading} sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <CircularProgress color={"inherit"}/>
            </Backdrop>
            <Snackbar open={alertVision} onClose={() => setAlertVision(false)}>
                <Alert severity={alertType} sx={{width: '100%'}}
                       onClose={() => setAlertVision(false)}>{alertMessage}</Alert>
            </Snackbar>
        </Box>
    );
};

export default GetDump;