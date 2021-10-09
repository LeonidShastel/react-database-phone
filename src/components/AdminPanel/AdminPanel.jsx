import React, {useEffect, useState} from 'react';
import {
    Box,
    Stack,
    Typography,
    Paper,
    Tooltip,
    IconButton,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    TextField,
    MenuItem,
    Select, Button
} from "@mui/material";
import axios from "axios";
import AlertPopup from "../AlertPopup";
import {ListItem} from "@material-ui/core";
import {ClearOutlined, DeleteOutlined, EditOutlined, ExpandLessOutlined,} from "@material-ui/icons";
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const [cities, setCities] = useState([]);
    const [users, setUsers] = useState([]);
    const [newUser,setNewUser] = useState({});

    const [loading, setLoading] = useState(true);
    const [alertVision, setAlertVision] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const setAlert = (type, message, vision = true) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertVision(vision);
    }

    const getCities = async () => {
        setCities([]);
        return await axios.get(`http://thelax67.beget.tech/options.php?option=cities`)
            .then(response => {
                response.data.map(el => {
                    setCities(prevArray => [...prevArray, el])
                })
            })
            .catch(error => {
                setAlert('error', error.message, true);
            })
    }

    const getUsers = async () => {
        setUsers([]);
        return await axios.get(`http://thelax67.beget.tech/options.php?option=users`)
            .then(response => {
                response.data.map(el => {
                    setUsers((prevState => [...prevState, el]))
                })
            })
            .catch(error => {
                setAlert('error', error.message)
            })
    }
    const updateStateUsers = (index, field, e) => {
        const newArray = [...users];
        newArray[index] = {...newArray[index], field: e.target.value}
        setUsers(newArray);
    }
    const updateAccessCities = (city, indexUser,value) => {
        const prevUsers = [...users];
        const access = JSON.parse(prevUsers[indexUser].accessCities);
        let find = false;
        for(let i = 0; i<access.length; i++){
            if(access[i].city===city){
                access[i].count=value;
                find=true;
                break;
            }
        }
        if(!find){
            access.push({
                city: city,
                count: value
            })
        }
        prevUsers[indexUser].accessCities = JSON.stringify(access);
        setUsers(prevUsers);
    }
    const searchValueCities =(indexUser, city)=>{
        const access = JSON.parse(users[indexUser].accessCities, city);
        for(let i = 0;i<access.length;i++){
            if(access[i].city===city){
                return access[i].count;
            }
        }
        return 0;
    }
    const deleteUser = async (email)=>{
        return await axios.get(`http://thelax67.beget.tech/options.php?option=delete_user&email=${email}`)
            .then(response=>{
                setAlert('success', 'Пользователь удален')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
    }
    const addUser = async ()=>{
        return await axios.get(`http://thelax67.beget.tech/options.php?option=add_user&email=${newUser.email}&password=${newUser.password}&privileges=${newUser.privileges}`)
            .then(response=>{
                setAlert('success', 'Пользователь добавлен')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
    }
    const saveUser = async (index) => {
        const user = users[index];
        const body = {
            email: user.email,
            password: user.password,
            privileges: user.privileges,
            accessCities: user.accessCities,
        }
        return await axios.post(`http://thelax67.beget.tech/options.php`,{
            option: 'save_user',
            body: body,
        })
            .then(response=>{
                setAlert('success', 'Пользователь добавлен')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
    }

    useEffect(() => {
        getCities();
        getUsers()
    }, []);


    return (
        <Box>
            <Box>
                <Typography variant={"h5"} sx={{color: '#1976D2', marginBottom: 5}}>Админ панель</Typography>
            </Box>
            <Box sx={{marginBottom: 2}}>
                <Typography variant={"h6"} sx={{color: '#1976D2', marginBottom: 2}}>Базы данных</Typography>
                {cities.length !== 0 ? <Stack>
                    {cities.map((el, index) => (
                        <ListItem key={index} sx={{display: 'flex'}}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandLessOutlined/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{el.title.split('_').join(' ').split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ')}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {`В базе: ${el.numberPhones}`}<br/>{`Доступно для выгрузки: ${el.numberAvailablePhones}`}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Tooltip title={'Очистить'}>
                                <IconButton>
                                    <ClearOutlined/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={'Удалить'}>
                                <IconButton>
                                    <DeleteOutlined/>
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </Stack> : <Box>Баз данных нет</Box>}
            </Box>
            <Box>
                <Typography variant={"h6"} sx={{color: '#1976D2', marginBottom: 2}}>Пользователи</Typography>
                <Stack>
                    {users.length !== 0 ?
                        users.map((el, indexUser) => (
                            <ListItem>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandLessOutlined/>}>
                                        <Typography>{indexUser + 1 + '. ' + el.email}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{display: 'flex', flexDirection: 'column'}}
                                                      className={styles.full_info} id={'full_info'}>
                                        <TextField margin="dense" label='E-mail' value={el.email}
                                                   onChange={e => updateStateUsers(indexUser, 'email', e)}/>
                                        <TextField margin="dense" label='Пароль' value={el.password}
                                                   onChange={e => updateStateUsers(indexUser, 'password', e)}/>
                                        {cities.length !== 0 ?
                                            cities.map((el,indexCity) => (
                                                <TextField key={indexCity} margin="dense" label={el.title} value={searchValueCities(indexUser, el.title)} onChange={e=>updateAccessCities(el.title, indexUser, e.target.value)}/>
                                            ))
                                            : <Typography>Базы отсутствуют</Typography>}
                                        <Button sx={{marginTop: 2}} variant={'outlined'} onClick={()=>saveUser(indexUser)}>Сохранить</Button>
                                        <Button sx={{marginTop: 1}} variant={'outlined'} onClick={()=>deleteUser(el.email)}>Удалить пользователя</Button>
                                    </AccordionDetails>
                                </Accordion>
                            </ListItem>
                        )) : <ListItem><Typography>Пользователи отсутствуют</Typography></ListItem>}
                    <ListItem>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandLessOutlined/>}>
                                <Typography>Добавить пользователя</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{display: 'flex', flexDirection: 'column'}}
                                              className={styles.full_info} id={'full_info'}>
                                <TextField margin="dense" label='E-mail' value={newUser.email}
                                           onChange={e => setNewUser({...newUser, email:e.target.value})}/>
                                <TextField margin="dense" label='Пароль' value={newUser.password}
                                           onChange={e => setNewUser({...newUser, password:e.target.value})}/>
                                <TextField margin="dense" label='Доступ (admin/user)' value={newUser.privileges}
                                           onChange={e => setNewUser({...newUser, privileges:e.target.value})}/>
                                <Button sx={{marginTop: 2}} variant={'outlined'} onClick={addUser}>Сохранить</Button>
                            </AccordionDetails>
                        </Accordion>
                    </ListItem>
                </Stack>
            </Box>
            <AlertPopup vision={alertVision} setVision={setAlertVision} type={alertType} message={alertMessage}/>
        </Box>
    );
};

export default AdminPanel;